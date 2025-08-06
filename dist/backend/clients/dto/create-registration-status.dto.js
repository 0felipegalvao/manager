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
exports.CreateRegistrationStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRegistrationStatusDto {
}
exports.CreateRegistrationStatusDto = CreateRegistrationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do registro federal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status federal deve ser uma string' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "federalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do registro estadual',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status estadual deve ser uma string' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "stateStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do registro municipal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Status municipal deve ser uma string' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "municipalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data do registro federal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data federal deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "federalDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data do registro estadual',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data estadual deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "stateDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data do registro municipal',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data municipal deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "municipalDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Observações',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Observações deve ser uma string' }),
    __metadata("design:type", String)
], CreateRegistrationStatusDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente',
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    __metadata("design:type", Number)
], CreateRegistrationStatusDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-registration-status.dto.js.map