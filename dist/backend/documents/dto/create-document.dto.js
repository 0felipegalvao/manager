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
exports.CreateDocumentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_1 = require("../../../generated/prisma");
class CreateDocumentDto {
    constructor() {
        this.status = prisma_1.DocumentStatus.PENDENTE;
        this.version = 1;
        this.tags = [];
    }
}
exports.CreateDocumentDto = CreateDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do documento',
        example: 'Nota Fiscal Janeiro 2024',
    }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do arquivo',
        example: 'nf_janeiro_2024.pdf',
    }),
    (0, class_validator_1.IsString)({ message: 'Nome do arquivo deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome do arquivo é obrigatório' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Caminho do arquivo no servidor',
        example: '/uploads/documents/nf_janeiro_2024.pdf',
    }),
    (0, class_validator_1.IsString)({ message: 'Caminho do arquivo deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Caminho do arquivo é obrigatório' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tamanho do arquivo em bytes',
        example: 1024000,
    }),
    (0, class_validator_1.IsInt)({ message: 'Tamanho do arquivo deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'Tamanho do arquivo deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateDocumentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo MIME do arquivo',
        example: 'application/pdf',
    }),
    (0, class_validator_1.IsString)({ message: 'Tipo MIME deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tipo MIME é obrigatório' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo do documento',
        enum: prisma_1.DocumentType,
        example: prisma_1.DocumentType.NOTA_FISCAL,
    }),
    (0, class_validator_1.IsEnum)(prisma_1.DocumentType, { message: 'Tipo de documento inválido' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do documento',
        enum: prisma_1.DocumentStatus,
        example: prisma_1.DocumentStatus.PENDENTE,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.DocumentStatus, { message: 'Status inválido' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição do documento',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descrição deve ser uma string' }),
    __metadata("design:type", String)
], CreateDocumentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Versão do documento',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Versão deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'Versão deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateDocumentDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tags do documento',
        example: ['fiscal', 'janeiro', '2024'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Tags deve ser um array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada tag deve ser uma string' }),
    __metadata("design:type", Array)
], CreateDocumentDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente',
        example: 1,
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'ID do cliente deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateDocumentDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-document.dto.js.map