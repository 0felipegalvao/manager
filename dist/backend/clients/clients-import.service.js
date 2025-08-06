"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ClientsImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsImportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const prisma_1 = require("../../generated/prisma");
const XLSX = __importStar(require("xlsx"));
let ClientsImportService = ClientsImportService_1 = class ClientsImportService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ClientsImportService_1.name);
    }
    async importFromFile(buffer, userId) {
        const result = {
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
            const data = XLSX.utils.sheet_to_json(worksheet);
            this.logger.log(`Iniciando importação de ${data.length} linhas`);
            // Processar cada linha
            for (let i = 0; i < data.length; i++) {
                const lineNumber = i + 2; // +2 porque linha 1 é cabeçalho e array é 0-indexed
                const row = data[i];
                result.totalProcessed++;
                try {
                    await this.processRow(row, lineNumber, userId, result);
                }
                catch (error) {
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
        }
        catch (error) {
            this.logger.error('Erro ao processar arquivo:', error);
            throw new Error(`Erro ao processar arquivo: ${error.message}`);
        }
    }
    async processRow(row, lineNumber, userId, result) {
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
        }
        else {
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
    mapRowToClient(row, userId) {
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
    extractCustomFields(row) {
        const customFields = {};
        // Mapear campos extras para customFields
        if (row.Cpf)
            customFields.cpf = row.Cpf.trim();
        if (row['Cod. Simples'])
            customFields.codigoSimples = row['Cod. Simples'].trim();
        if (row['Inscr. Estadual'])
            customFields.inscricaoEstadual = row['Inscr. Estadual'].trim();
        if (row['Inicio Atividade'])
            customFields.inicioAtividade = this.parseDate(row['Inicio Atividade']);
        if (row['Inicio Escritorio'])
            customFields.inicioEscritorio = this.parseDate(row['Inicio Escritorio']);
        if (row.Porte)
            customFields.porte = row.Porte.trim();
        if (row.Departamento)
            customFields.departamento = row.Departamento.trim();
        if (row['Porc PJ ecac'])
            customFields.porcPJEcac = row['Porc PJ ecac'].trim();
        if (row['Proc PF ecac'])
            customFields.procPFEcac = row['Proc PF ecac'].trim();
        if (row['Data Situaçao'])
            customFields.dataSituacao = this.parseDate(row['Data Situaçao']);
        if (row.Obs)
            customFields.observacoes = row.Obs.trim();
        return customFields;
    }
    cleanCnpj(cnpj) {
        return cnpj.replace(/\D/g, ''); // Remove tudo que não é dígito
    }
    isValidCnpj(cnpj) {
        return cnpj.length === 14 && /^\d{14}$/.test(cnpj);
    }
    mapTaxRegime(regime) {
        if (!regime)
            return prisma_1.TaxRegime.SIMPLES_NACIONAL;
        const regimeUpper = regime.toUpperCase().trim();
        if (regimeUpper.includes('SIMPLES'))
            return prisma_1.TaxRegime.SIMPLES_NACIONAL;
        if (regimeUpper.includes('NORMAL') || regimeUpper.includes('PRESUMIDO'))
            return prisma_1.TaxRegime.LUCRO_PRESUMIDO;
        if (regimeUpper.includes('REAL'))
            return prisma_1.TaxRegime.LUCRO_REAL;
        if (regimeUpper.includes('MEI'))
            return prisma_1.TaxRegime.MEI;
        return prisma_1.TaxRegime.SIMPLES_NACIONAL; // Default
    }
    mapStatus(situacao) {
        if (!situacao)
            return prisma_1.ClientStatus.ATIVO;
        const situacaoUpper = situacao.toUpperCase().trim();
        if (situacaoUpper.includes('ATIVA') || situacaoUpper.includes('ATIVO'))
            return prisma_1.ClientStatus.ATIVO;
        if (situacaoUpper.includes('INATIVA') || situacaoUpper.includes('INATIVO'))
            return prisma_1.ClientStatus.INATIVO;
        return prisma_1.ClientStatus.ATIVO; // Default
    }
    parseDate(dateStr) {
        if (!dateStr)
            return undefined;
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
        }
        catch (error) {
            this.logger.warn(`Erro ao converter data: ${dateStr}`);
        }
        return undefined;
    }
    async updateExistingClient(clientId, clientData, row) {
        // Buscar customFields existentes
        const existingClient = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: { customFields: true }
        });
        // Mesclar customFields existentes com novos (não sobrescrever)
        const existingCustomFields = existingClient?.customFields || {};
        const newCustomFields = clientData.customFields || {};
        const mergedCustomFields = { ...existingCustomFields, ...newCustomFields };
        // Atualizar apenas campos que não são nulos/vazios
        const updateData = {
            customFields: mergedCustomFields
        };
        // Atualizar campos básicos apenas se não estão vazios
        if (clientData.razaoSocial)
            updateData.razaoSocial = clientData.razaoSocial;
        if (clientData.estado)
            updateData.estado = clientData.estado;
        if (clientData.cidade)
            updateData.cidade = clientData.cidade;
        if (clientData.taxRegime)
            updateData.taxRegime = clientData.taxRegime;
        if (clientData.status)
            updateData.status = clientData.status;
        await this.prisma.client.update({
            where: { id: clientId },
            data: updateData
        });
    }
    async createNewClient(clientData) {
        await this.prisma.client.create({
            data: clientData
        });
    }
};
exports.ClientsImportService = ClientsImportService;
exports.ClientsImportService = ClientsImportService = ClientsImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsImportService);
//# sourceMappingURL=clients-import.service.js.map