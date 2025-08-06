import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsDateString, IsDecimal, Length, Matches, IsObject, IsInt } from 'class-validator';
import { TaxRegime, ClientStatus, CompanySize, EcacPJ, EcacPF } from '../../../generated/prisma';

export class CreateClientDto {
  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Empresa Exemplo Ltda',
  })
  @IsString({ message: 'Razão social deve ser uma string' })
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  razaoSocial: string;

  @ApiProperty({
    description: 'Nome fantasia da empresa',
    example: 'Empresa Exemplo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome fantasia deve ser uma string' })
  nomeFantasia?: string;

  @ApiProperty({
    description: 'CNPJ da empresa (apenas números)',
    example: '12345678000195',
  })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Length(14, 14, { message: 'CNPJ deve ter 14 dígitos' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;

  @ApiProperty({
    description: 'Inscrição estadual',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Inscrição estadual deve ser uma string' })
  inscricaoEstadual?: string;

  @ApiProperty({
    description: 'Inscrição municipal',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Inscrição municipal deve ser uma string' })
  inscricaoMunicipal?: string;

  @ApiProperty({
    description: 'Regime tributário',
    enum: TaxRegime,
    example: TaxRegime.SIMPLES_NACIONAL,
  })
  @IsEnum(TaxRegime, { message: 'Regime tributário inválido' })
  taxRegime: TaxRegime;

  @ApiProperty({
    description: 'Status do cliente',
    enum: ClientStatus,
    example: ClientStatus.ATIVO,
    required: false,
  })
  @IsOptional()
  @IsEnum(ClientStatus, { message: 'Status inválido' })
  status?: ClientStatus = ClientStatus.ATIVO;

  @ApiProperty({
    description: 'Endereço',
    example: 'Rua das Flores',
  })
  @IsString({ message: 'Endereço deve ser uma string' })
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  endereco: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
  })
  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  numero: string;

  @ApiProperty({
    description: 'Complemento',
    example: 'Sala 101',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complemento?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  bairro: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  cidade: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
  })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres' })
  estado: string;

  @ApiProperty({
    description: 'CEP (apenas números)',
    example: '01234567',
  })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Length(8, 8, { message: 'CEP deve ter 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  cep: string;

  @ApiProperty({
    description: 'Telefone',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  telefone?: string;

  @ApiProperty({
    description: 'Celular',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Celular deve ser uma string' })
  celular?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Email do contador responsável',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email do contador deve ter um formato válido' })
  emailContador?: string;

  @ApiProperty({
    description: 'Data de abertura da empresa',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de abertura deve ser uma data válida' })
  dataAbertura?: string;

  @ApiProperty({
    description: 'Capital social',
    required: false,
  })
  @IsOptional()
  @IsDecimal({}, { message: 'Capital social deve ser um valor decimal' })
  capitalSocial?: string;

  @ApiProperty({
    description: 'Atividade principal',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Atividade principal deve ser uma string' })
  atividadePrincipal?: string;

  @ApiProperty({
    description: 'Data de vencimento dos serviços',
    example: '2024-01-31',
  })
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  dataVencimento: string;

  @ApiProperty({
    description: 'Valor mensal dos serviços',
    required: false,
  })
  @IsOptional()
  @IsDecimal({}, { message: 'Valor mensal deve ser um valor decimal' })
  valorMensal?: string;

  @ApiProperty({
    description: 'Observações',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  observacoes?: string;

  // Campos específicos do sistema contábil
  @ApiProperty({
    description: 'CPF do responsável',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  cpf?: string;

  @ApiProperty({
    description: 'Código do Simples Nacional',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Código Simples deve ser uma string' })
  codigoSimples?: string;

  @ApiProperty({
    description: 'Data de início da atividade',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Início da atividade deve ser uma data válida' })
  inicioAtividade?: string;

  @ApiProperty({
    description: 'Data de início no escritório',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Início no escritório deve ser uma data válida' })
  inicioEscritorio?: string;

  @ApiProperty({
    description: 'Data da situação',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data da situação deve ser uma data válida' })
  dataSituacao?: string;

  @ApiProperty({
    description: 'Porte da empresa',
    enum: CompanySize,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanySize, { message: 'Porte inválido' })
  porte?: CompanySize;

  @ApiProperty({
    description: 'ID do departamento',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'ID do departamento deve ser um número inteiro' })
  departmentId?: number;

  @ApiProperty({
    description: 'Procuração PJ ECAC',
    enum: EcacPJ,
    required: false,
  })
  @IsOptional()
  @IsEnum(EcacPJ, { message: 'Valor ECAC PJ inválido' })
  porcPJEcac?: EcacPJ;

  @ApiProperty({
    description: 'Procuração PF ECAC',
    enum: EcacPF,
    required: false,
  })
  @IsOptional()
  @IsEnum(EcacPF, { message: 'Valor ECAC PF inválido' })
  procPFEcac?: EcacPF;

  @ApiProperty({
    description: 'Campos personalizados (JSON) - apenas para campos dinâmicos',
    required: false,
    example: {
      campoPersonalizado1: 'valor1',
      campoPersonalizado2: 'valor2'
    }
  })
  @IsOptional()
  @IsObject({ message: 'Campos personalizados deve ser um objeto' })
  customFields?: Record<string, any>;
}
