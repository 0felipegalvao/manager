import { ApiProperty } from '@nestjs/swagger';

export class ImportResultDto {
  @ApiProperty({
    description: 'Total de linhas processadas',
    example: 100
  })
  totalProcessed: number;

  @ApiProperty({
    description: 'Clientes criados com sucesso',
    example: 80
  })
  created: number;

  @ApiProperty({
    description: 'Clientes atualizados com sucesso',
    example: 15
  })
  updated: number;

  @ApiProperty({
    description: 'Linhas com erro',
    example: 5
  })
  errors: number;

  @ApiProperty({
    description: 'Lista detalhada de erros',
    example: [
      {
        line: 10,
        cnpj: '12345678000195',
        error: 'CNPJ inválido'
      }
    ]
  })
  errorDetails: Array<{
    line: number;
    cnpj?: string;
    razaoSocial?: string;
    error: string;
  }>;

  @ApiProperty({
    description: 'Lista de clientes processados com sucesso',
    example: [
      {
        line: 1,
        cnpj: '11365521000169',
        razaoSocial: '.COM CONSTRUCOES E EMPREENDIMENTOS LTDA',
        action: 'created'
      }
    ]
  })
  successDetails: Array<{
    line: number;
    cnpj: string;
    razaoSocial: string;
    action: 'created' | 'updated';
  }>;
}

// Interface para mapear dados da planilha
export interface SpreadsheetRow {
  'Razão Social'?: string;
  'Cnpj'?: string;
  'Uf'?: string;
  'Município'?: string;
  'Regime Tributario'?: string;
  'Situação'?: string;
  'Cpf'?: string;
  'Cod. Simples'?: string;
  'Inscr. Estadual'?: string;
  'Inicio Atividade'?: string;
  'Inicio Escritorio'?: string;
  'Porte'?: string;
  'Departamento'?: string;
  'Porc PJ ecac'?: string;
  'Proc PF ecac'?: string;
  'Data Situaçao'?: string;
  'Obs'?: string;
  [key: string]: any; // Para campos extras não mapeados
}
