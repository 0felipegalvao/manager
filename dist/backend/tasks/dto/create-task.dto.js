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
exports.CreateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTaskDto {
    constructor() {
        this.status = 'PENDENTE';
        this.priority = 1;
    }
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título da tarefa',
        example: 'Processar documentos do cliente XYZ',
    }),
    (0, class_validator_1.IsString)({ message: 'Título deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Título é obrigatório' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição detalhada da tarefa',
        example: 'Processar e organizar todos os documentos fiscais do cliente XYZ para o mês de janeiro',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Descrição deve ser uma string' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da tarefa',
        example: 'PENDENTE',
        enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status deve ser uma string' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prioridade da tarefa (1=baixa, 2=média, 3=alta)',
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
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de vencimento da tarefa',
        example: '2024-12-31T23:59:59.000Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de vencimento deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da obrigação relacionada à tarefa',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'ID da obrigação deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'ID da obrigação deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "obligationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente relacionado à tarefa',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'ID do cliente deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-task.dto.js.map