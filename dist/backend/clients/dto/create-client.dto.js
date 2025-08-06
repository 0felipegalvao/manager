"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_1 = require("../../../generated/prisma");
class CreateClientDto {
    constructor() {
        this.status = prisma_1.ClientStatus.ATIVO;
    }
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Razão social da empresa',
        example: 'Empresa Exemplo Ltda',
    }),
    (0, class_validator_1.IsString)({ message: 'Razão social deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Razão social é obrigatória' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "razaoSocial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome fantasia da empresa',
        example: 'Empresa Exemplo',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Nome fantasia deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "nomeFantasia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CNPJ da empresa (apenas números)',
        example: '12345678000195',
    }),
    (0, class_validator_1.IsString)({ message: 'CNPJ deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'CNPJ é obrigatório' }),
    (0, class_validator_1.Length)(14, 14, { message: 'CNPJ deve ter 14 dígitos' }),
    (0, class_validator_1.Matches)(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inscrição estadual',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Inscrição estadual deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "inscricaoEstadual", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Inscrição municipal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Inscrição municipal deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "inscricaoMunicipal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Regime tributário',
        enum: prisma_1.TaxRegime,
        example: prisma_1.TaxRegime.SIMPLES_NACIONAL,
    }),
    (0, class_validator_1.IsEnum)(prisma_1.TaxRegime, { message: 'Regime tributário inválido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "taxRegime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do cliente',
        enum: prisma_1.ClientStatus,
        example: prisma_1.ClientStatus.ATIVO,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.ClientStatus, { message: 'Status inválido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Endereço',
        example: 'Rua das Flores',
    }),
    (0, class_validator_1.IsString)({ message: 'Endereço deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Endereço é obrigatório' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "endereco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número',
        example: '123',
    }),
    (0, class_validator_1.IsString)({ message: 'Número deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Número é obrigatório' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "numero", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Complemento',
        example: 'Sala 101',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Complemento deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "complemento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bairro',
        example: 'Centro',
    }),
    (0, class_validator_1.IsString)({ message: 'Bairro deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bairro é obrigatório' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "bairro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cidade',
        example: 'São Paulo',
    }),
    (0, class_validator_1.IsString)({ message: 'Cidade deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Cidade é obrigatória' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "cidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado (UF)',
        example: 'SP',
    }),
    (0, class_validator_1.IsString)({ message: 'Estado deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Estado é obrigatório' }),
    (0, class_validator_1.Length)(2, 2, { message: 'Estado deve ter 2 caracteres' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CEP (apenas números)',
        example: '01234567',
    }),
    (0, class_validator_1.IsString)({ message: 'CEP deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'CEP é obrigatório' }),
    (0, class_validator_1.Length)(8, 8, { message: 'CEP deve ter 8 dígitos' }),
    (0, class_validator_1.Matches)(/^\d{8}$/, { message: 'CEP deve conter apenas números' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telefone',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Telefone deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Celular',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Celular deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "celular", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ter um formato válido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email do contador responsável',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email do contador deve ter um formato válido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "emailContador", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de abertura da empresa',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de abertura deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "dataAbertura", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Capital social',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({}, { message: 'Capital social deve ser um valor decimal' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "capitalSocial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Atividade principal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Atividade principal deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "atividadePrincipal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de vencimento dos serviços',
        example: '2024-01-31',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de vencimento deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "dataVencimento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor mensal dos serviços',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({}, { message: 'Valor mensal deve ser um valor decimal' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "valorMensal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Observações',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Observações deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "observacoes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CPF do responsável',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'CPF deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código do Simples Nacional',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Código Simples deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "codigoSimples", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de início da atividade',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Início da atividade deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "inicioAtividade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de início no escritório',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Início no escritório deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "inicioEscritorio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data da situação',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data da situação deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "dataSituacao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Porte da empresa',
        enum: prisma_1.CompanySize,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.CompanySize, { message: 'Porte inválido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "porte", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do departamento',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'ID do departamento deve ser um número inteiro' }),
    __metadata("design:type", Number)
], CreateClientDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Procuração PJ ECAC',
        enum: prisma_1.EcacPJ,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.EcacPJ, { message: 'Valor ECAC PJ inválido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "porcPJEcac", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Procuração PF ECAC',
        enum: prisma_1.EcacPF,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.EcacPF, { message: 'Valor ECAC PF inválido' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "procPFEcac", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Campos personalizados (JSON) - apenas para campos dinâmicos',
        required: false,
        example: {
            campoPersonalizado1: 'valor1',
            campoPersonalizado2: 'valor2'
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Campos personalizados deve ser um objeto' }),
    __metadata("design:type", Object)
], CreateClientDto.prototype, "customFields", void 0);
//# sourceMappingURL=create-client.dto.js.map