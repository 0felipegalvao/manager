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
exports.CreateTaxRegimeHistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_1 = require("../../../generated/prisma");
class CreateTaxRegimeHistoryDto {
}
exports.CreateTaxRegimeHistoryDto = CreateTaxRegimeHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Regime tributário',
        enum: prisma_1.TaxRegime,
    }),
    (0, class_validator_1.IsEnum)(prisma_1.TaxRegime, { message: 'Regime tributário inválido' }),
    __metadata("design:type", String)
], CreateTaxRegimeHistoryDto.prototype, "taxRegime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de início do regime',
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de início deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateTaxRegimeHistoryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de fim do regime',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de fim deve ser uma data válida' }),
    __metadata("design:type", String)
], CreateTaxRegimeHistoryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Motivo da mudança',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Motivo deve ser uma string' }),
    __metadata("design:type", String)
], CreateTaxRegimeHistoryDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Observações',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Observações deve ser uma string' }),
    __metadata("design:type", String)
], CreateTaxRegimeHistoryDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do cliente',
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do cliente deve ser um número inteiro' }),
    __metadata("design:type", Number)
], CreateTaxRegimeHistoryDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-tax-regime-history.dto.js.map