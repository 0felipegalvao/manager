import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { TaxRegime, ClientStatus } from '../../generated/prisma';
import { ImportResultDto, SpreadsheetRow } from './dto/import-client.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class ClientsImportService {
  private readonly logger = new Logger(ClientsImportService.name);

  constructor(private prisma: PrismaService) {}

  async importFromFile(buffer: Buffer, userId: number): Promise<ImportResultDto> {
    const result: ImportResultDto = {
      totalProcessed: 0,
      created: 0,
      updated: 0,
      errors: 0,
      errorDetails: [],
      successDetails: []
    };

    try {
      // Ler arquivo Excel/CSV
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: SpreadsheetRow[] = XLSX.utils.sheet_to_json(worksheet);

      this.logger.log(`Iniciando importação de ${data.length} linhas`);

      // Processar cada linha
      for (let i = 0; i < data.length; i++) {
        const lineNumber = i + 2; // +2 porque linha 1 é cabeçalho e array é 0-indexed
        const row = data[i];
        result.totalProcessed++;

        try {
          await this.processRow(row, lineNumber, userId, result);
        } catch (error) {
          this.logger.error(`Erro na linha ${lineNumber}:`, error);
          result.errors++;
          result.errorDetails.push({
            line: lineNumber,
            cnpj: row.Cnpj,
            razaoSocial: row['Razão Social'],
            error: error.message || 'Erro desconhecido'
          });
        }
      }

      this.logger.log(`Importação concluída: ${result.created} criados, ${result.updated} atualizados, ${result.errors} erros`);
      return result;

    } catch (error) {
      this.logger.error('Erro ao processar arquivo:', error);
      throw new Error(`Erro ao processar arquivo: ${error.message}`);
    }
  }

  private async processRow(
    row: SpreadsheetRow, 
    lineNumber: number, 
    userId: number, 
    result: ImportResultDto
  ): Promise<void> {
    // Validar dados obrigatórios
    if (!row['Razão Social'] || !row.Cnpj) {
      throw new Error('Razão Social e CNPJ são obrigatórios');
    }

    // Limpar e validar CNPJ
    const cnpj = this.cleanCnpj(row.Cnpj);
    if (!this.isValidCnpj(cnpj)) {
      throw new Error('CNPJ inválido');
    }

    // Mapear dados básicos
    const clientData = this.mapRowToClient(row, userId);

    // Verificar se cliente já existe
    const existingClient = await this.prisma.client.findUnique({
      where: { cnpj }
    });

    if (existingClient) {
      // Atualizar cliente existente
      await this.updateExistingClient(existingClient.id, clientData, row);
      result.updated++;
      result.successDetails.push({
        line: lineNumber,
        cnpj,
        razaoSocial: row['Razão Social'],
        action: 'updated'
      });
    } else {
      // Criar novo cliente
      await this.createNewClient(clientData);
      result.created++;
      result.successDetails.push({
        line: lineNumber,
        cnpj,
        razaoSocial: row['Razão Social'],
        action: 'created'
      });
    }
  }

  private mapRowToClient(row: SpreadsheetRow, userId: number) {
    const customFields = this.extractCustomFields(row);

    return {
      razaoSocial: row['Razão Social'].trim(),
      cnpj: this.cleanCnpj(row.Cnpj),
      estado: row.Uf?.trim() || 'SP', // Default SP se não informado
      cidade: row['Município']?.trim() || 'São Paulo', // Default
      taxRegime: this.mapTaxRegime(row['Regime Tributario']),
      status: this.mapStatus(row['Situação']),
      userId,
      customFields,
      // Campos obrigatórios com valores padrão
      endereco: 'A definir',
      numero: 'S/N',
      bairro: 'Centro',
      cep: '00000000',
      dataVencimento: new Date(new Date().getFullYear(), 11, 31) // 31 de dezembro do ano atual
    };
  }

  private extractCustomFields(row: SpreadsheetRow): Record<string, any> {
    const customFields: Record<string, any> = {};

    // Mapear campos extras para customFields
    if (row.Cpf) customFields.cpf = row.Cpf.trim();
    if (row['Cod. Simples']) customFields.codigoSimples = row['Cod. Simples'].trim();
    if (row['Inscr. Estadual']) customFields.inscricaoEstadual = row['Inscr. Estadual'].trim();
    if (row['Inicio Atividade']) customFields.inicioAtividade = this.parseDate(row['Inicio Atividade']);
    if (row['Inicio Escritorio']) customFields.inicioEscritorio = this.parseDate(row['Inicio Escritorio']);
    if (row.Porte) customFields.porte = row.Porte.trim();
    if (row.Departamento) customFields.departamento = row.Departamento.trim();
    if (row['Porc PJ ecac']) customFields.porcPJEcac = row['Porc PJ ecac'].trim();
    if (row['Proc PF ecac']) customFields.procPFEcac = row['Proc PF ecac'].trim();
    if (row['Data Situaçao']) customFields.dataSituacao = this.parseDate(row['Data Situaçao']);
    if (row.Obs) customFields.observacoes = row.Obs.trim();

    return customFields;
  }

  private cleanCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, ''); // Remove tudo que não é dígito
  }

  private isValidCnpj(cnpj: string): boolean {
    return cnpj.length === 14 && /^\d{14}$/.test(cnpj);
  }

  private mapTaxRegime(regime?: string): TaxRegime {
    if (!regime) return TaxRegime.SIMPLES_NACIONAL;

    const regimeUpper = regime.toUpperCase().trim();
    
    if (regimeUpper.includes('SIMPLES')) return TaxRegime.SIMPLES_NACIONAL;
    if (regimeUpper.includes('NORMAL') || regimeUpper.includes('PRESUMIDO')) return TaxRegime.LUCRO_PRESUMIDO;
    if (regimeUpper.includes('REAL')) return TaxRegime.LUCRO_REAL;
    if (regimeUpper.includes('MEI')) return TaxRegime.MEI;
    
    return TaxRegime.SIMPLES_NACIONAL; // Default
  }

  private mapStatus(situacao?: string): ClientStatus {
    if (!situacao) return ClientStatus.ATIVO;

    const situacaoUpper = situacao.toUpperCase().trim();
    
    if (situacaoUpper.includes('ATIVA') || situacaoUpper.includes('ATIVO')) return ClientStatus.ATIVO;
    if (situacaoUpper.includes('INATIVA') || situacaoUpper.includes('INATIVO')) return ClientStatus.INATIVO;
    
    return ClientStatus.ATIVO; // Default
  }

  private parseDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;

    try {
      // Tentar formato dd/mm/yyyy
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
        const year = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0]; // Retorna YYYY-MM-DD
      }
    } catch (error) {
      this.logger.warn(`Erro ao converter data: ${dateStr}`);
    }

    return undefined;
  }

  private async updateExistingClient(clientId: number, clientData: any, row: SpreadsheetRow): Promise<void> {
    // Buscar customFields existentes
    const existingClient = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { customFields: true }
    });

    // Mesclar customFields existentes com novos (não sobrescrever)
    const existingCustomFields = (existingClient?.customFields as Record<string, any>) || {};
    const newCustomFields = clientData.customFields || {};
    const mergedCustomFields = { ...existingCustomFields, ...newCustomFields };

    // Atualizar apenas campos que não são nulos/vazios
    const updateData: any = {
      customFields: mergedCustomFields
    };

    // Atualizar campos básicos apenas se não estão vazios
    if (clientData.razaoSocial) updateData.razaoSocial = clientData.razaoSocial;
    if (clientData.estado) updateData.estado = clientData.estado;
    if (clientData.cidade) updateData.cidade = clientData.cidade;
    if (clientData.taxRegime) updateData.taxRegime = clientData.taxRegime;
    if (clientData.status) updateData.status = clientData.status;

    await this.prisma.client.update({
      where: { id: clientId },
      data: updateData
    });
  }

  private async createNewClient(clientData: any): Promise<void> {
    await this.prisma.client.create({
      data: clientData
    });
  }
}
