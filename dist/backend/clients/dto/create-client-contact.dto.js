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
exports.CreateClientContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateClientContactDto {
}
exports.CreateClientContactDto = CreateClientContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do contato',
        example: 'Maria Santos',
    }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    __metadata("design:type", String)
], CreateClientContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email do contato',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ter um formato válido' }),
    __metadata("design:type", String)
], CreateClientContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telefone do contato',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Telefone deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientContactDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Celular do contato',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Celular deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientContactDto.prototype, "cellphone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cargo/posição do contato',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Posição deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientContactDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Departamento do contato',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Departamento deve ser uma string' }),
    __metadata("design:type", String)
], CreateClientContactDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Se o contato está ativo',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'IsActive deve ser um valor booleano' }),
    __metadata("design:type", Boolean)
], CreateClientContactDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente',
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    __metadata("design:type", Number)
], CreateClientContactDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-client-contact.dto.js.map