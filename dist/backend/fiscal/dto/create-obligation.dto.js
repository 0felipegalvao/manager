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
exports.CreateObligationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_1 = require("../../../generated/prisma");
class CreateObligationDto {
    constructor() {
        this.status = prisma_1.ObligationStatus.PENDENTE;
        this.priority = 1;
        this.recurrent = false;
    }
}
exports.CreateObligationDto = CreateObligationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome da obrigação fiscal',
        example: 'DAS - Simples Nacional',
    }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    __metadata("design:type", String)
], CreateObligationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição da obrigação',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descrição deve ser uma string' }),
    __metadata("design:type", String)
], CreateObligationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo da obrigação',
        enum: prisma_1.ObligationType,
        example: prisma_1.ObligationType.MENSAL,
    }),
    (0, class_validator_1.IsEnum)(prisma_1.ObligationType, { message: 'Tipo de obrigação inválido' }),
    __metadata("design:type", String)
], CreateObligationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da obrigação',
        enum: prisma_1.ObligationStatus,
        example: prisma_1.ObligationStatus.PENDENTE,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(prisma_1.ObligationStatus, { message: 'Status inválido' }),
    __metadata("design:type", String)
], CreateObligationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de vencimento',
        example: '2024-01-31T23:59:59.000Z',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de vencimento deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateObligationDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de conclusão',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de conclusão deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateObligationDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prioridade (1=baixa, 2=média, 3=alta)',
        example: 2,
        minimum: 1,
        maximum: 3,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'Prioridade deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'Prioridade deve ser no mínimo 1' }),
    (0, class_validator_1.Max)(3, { message: 'Prioridade deve ser no máximo 3' }),
    __metadata("design:type", Number)
], CreateObligationDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Se a obrigação é recorrente',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Recorrente deve ser um valor booleano' }),
    __metadata("design:type", Boolean)
], CreateObligationDto.prototype, "recurrent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente',
        example: 1,
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'ID do cliente deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateObligationDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-obligation.dto.js.map