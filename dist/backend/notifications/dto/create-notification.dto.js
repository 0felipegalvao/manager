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
exports.CreateNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateNotificationDto {
    constructor() {
        this.type = 'INFO';
        this.read = false;
    }
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título da notificação',
        example: 'Obrigação Fiscal Próxima ao Vencimento',
    }),
    (0, class_validator_1.IsString)({ message: 'Título deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Título é obrigatório' }),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensagem da notificação',
        example: 'A obrigação DAS vence em 3 dias',
    }),
    (0, class_validator_1.IsString)({ message: 'Mensagem deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mensagem é obrigatória' }),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo da notificação',
        example: 'WARNING',
        enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Tipo deve ser uma string' }),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Se a notificação foi lida',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Read deve ser um valor booleano' }),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do usuário',
        example: 1,
    }),
    (0, class_validator_1.IsInt)({ message: 'ID do usuário deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'ID do usuário deve ser maior que 0' }),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "userId", void 0);
//# sourceMappingURL=create-notification.dto.js.map