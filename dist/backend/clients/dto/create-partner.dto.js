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
exports.CreatePartnerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePartnerDto {
}
exports.CreatePartnerDto = CreatePartnerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do sócio',
        example: 'João Silva',
    }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CPF do sócio',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'CPF deve ser uma string' }),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentual de participação',
        required: false,
        example: 50.00,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({}, { message: 'Participação deve ser um valor decimal' }),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "participacao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Qualificação do sócio',
        required: false,
        example: 'Administrador',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Qualificação deve ser uma string' }),
    __metadata("design:type", String)
], CreatePartnerDto.prototype, "qualificacao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente',
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    __metadata("design:type", Number)
], CreatePartnerDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-partner.dto.js.map