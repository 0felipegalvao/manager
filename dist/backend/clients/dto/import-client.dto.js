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
exports.ImportResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ImportResultDto {
}
exports.ImportResultDto = ImportResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total de linhas processadas',
        example: 100
    }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "totalProcessed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clientes criados com sucesso',
        example: 80
    }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "created", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clientes atualizados com sucesso',
        example: 15
    }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "updated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Linhas com erro',
        example: 5
    }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista detalhada de erros',
        example: [
            {
                line: 10,
                cnpj: '12345678000195',
                error: 'CNPJ inválido'
            }
        ]
    }),
    __metadata("design:type", Array)
], ImportResultDto.prototype, "errorDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de clientes processados com sucesso',
        example: [
            {
                line: 1,
                cnpj: '11365521000169',
                razaoSocial: '.COM CONSTRUCOES E EMPREENDIMENTOS LTDA',
                action: 'created'
            }
        ]
    }),
    __metadata("design:type", Array)
], ImportResultDto.prototype, "successDetails", void 0);
//# sourceMappingURL=import-client.dto.js.map