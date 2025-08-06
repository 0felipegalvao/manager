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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const prisma_1 = require("../../generated/prisma");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboardStats(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getDashboardStats(userId);
    }
    getClientsByStatus(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getClientsByStatus(userId);
    }
    getClientsByTaxRegime(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getClientsByTaxRegime(userId);
    }
    getDocumentsByType(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getDocumentsByType(userId);
    }
    getDocumentsByStatus(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getDocumentsByStatus(userId);
    }
    getObligationsByStatus(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getObligationsByStatus(userId);
    }
    getObligationsByType(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getObligationsByType(userId);
    }
    getMonthlyStats(user, year) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getMonthlyStats(+year, userId);
    }
    getTopClients(user, limit) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getTopClients(limit ? +limit : 10, userId);
    }
    getRevenueReport(user, year) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.reportsService.getRevenueReport(+year, userId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas do dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas do dashboard' }),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter clientes por status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribuição de clientes por status' }),
    (0, common_1.Get)('clients/by-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getClientsByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter clientes por regime tributário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribuição de clientes por regime tributário' }),
    (0, common_1.Get)('clients/by-tax-regime'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getClientsByTaxRegime", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter documentos por tipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribuição de documentos por tipo' }),
    (0, common_1.Get)('documents/by-type'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDocumentsByType", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter documentos por status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribuição de documentos por status' }),
    (0, common_1.Get)('documents/by-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDocumentsByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter obrigações por status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribuição de obrigações por status' }),
    (0, common_1.Get)('obligations/by-status'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getObligationsByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter obrigações por tipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Distribuição de obrigações por tipo' }),
    (0, common_1.Get)('obligations/by-type'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getObligationsByType", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas mensais' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas mensais do ano' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, description: 'Ano para o relatório' }),
    (0, common_1.Get)('monthly'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMonthlyStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter top clientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clientes com mais atividade' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Número de clientes (padrão: 10)' }),
    (0, common_1.Get)('clients/top'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getTopClients", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter relatório de receita' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Relatório de receita mensal' }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true, description: 'Ano para o relatório' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Get)('revenue'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenueReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map