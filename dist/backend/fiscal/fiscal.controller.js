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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiscalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fiscal_service_1 = require("./fiscal.service");
const create_obligation_dto_1 = require("./dto/create-obligation.dto");
const update_obligation_dto_1 = require("./dto/update-obligation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FiscalController = class FiscalController {
    constructor(fiscalService) {
        this.fiscalService = fiscalService;
    }
    createObligation(createObligationDto) {
        return this.fiscalService.createObligation(createObligationDto);
    }
    findAllObligations(clientId) {
        return this.fiscalService.findAllObligations(clientId ? +clientId : undefined);
    }
    getObligationStats(clientId) {
        return this.fiscalService.getObligationStats(clientId ? +clientId : undefined);
    }
    getUpcomingObligations(days, clientId) {
        return this.fiscalService.getUpcomingObligations(days ? +days : 30, clientId ? +clientId : undefined);
    }
    getOverdueObligations(clientId) {
        return this.fiscalService.getOverdueObligations(clientId ? +clientId : undefined);
    }
    getCalendarData(year, month, clientId) {
        return this.fiscalService.getCalendarData(+year, +month, clientId ? +clientId : undefined);
    }
    findObligationById(id) {
        return this.fiscalService.findObligationById(+id);
    }
    updateObligation(id, updateObligationDto) {
        return this.fiscalService.updateObligation(+id, updateObligationDto);
    }
    removeObligation(id) {
        return this.fiscalService.removeObligation(+id);
    }
};
exports.FiscalController = FiscalController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova obrigação fiscal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Obrigação criada com sucesso' }),
    (0, common_1.Post)('obligations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_obligation_dto_1.CreateObligationDto]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "createObligation", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as obrigações fiscais' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de obrigações fiscais' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('obligations'),
    __param(0, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "findAllObligations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas das obrigações fiscais' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas das obrigações' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('obligations/stats'),
    __param(0, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "getObligationStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter obrigações próximas ao vencimento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Obrigações próximas' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Número de dias (padrão: 30)' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('obligations/upcoming'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "getUpcomingObligations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter obrigações em atraso' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Obrigações em atraso' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('obligations/overdue'),
    __param(0, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "getOverdueObligations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter dados do calendário fiscal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dados do calendário' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, description: 'Ano' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true, description: 'Mês (1-12)' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('calendar'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "getCalendarData", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar obrigação por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Obrigação encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Obrigação não encontrada' }),
    (0, common_1.Get)('obligations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "findObligationById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar obrigação fiscal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Obrigação atualizada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Obrigação não encontrada' }),
    (0, common_1.Patch)('obligations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_obligation_dto_1.UpdateObligationDto]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "updateObligation", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover obrigação fiscal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Obrigação removida' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Obrigação não encontrada' }),
    (0, common_1.Delete)('obligations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FiscalController.prototype, "removeObligation", null);
exports.FiscalController = FiscalController = __decorate([
    (0, swagger_1.ApiTags)('fiscal'),
    (0, common_1.Controller)('fiscal'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [fiscal_service_1.FiscalService])
], FiscalController);
//# sourceMappingURL=fiscal.controller.js.map