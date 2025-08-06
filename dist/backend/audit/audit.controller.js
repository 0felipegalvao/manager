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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const prisma_1 = require("../../generated/prisma");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    findAll(user, entity, action, userId, startDate, endDate, page, limit) {
        const filters = {
            entity,
            action,
            userId: userId ? +userId : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        const pagination = {
            page: page ? +page : 1,
            limit: limit ? +limit : 50,
        };
        return this.auditService.findAll(filters, pagination);
    }
    getStats(startDate, endDate) {
        const filters = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        return this.auditService.getStats(filters);
    }
    findByEntity(entity, entityId, page, limit) {
        const pagination = {
            page: page ? +page : 1,
            limit: limit ? +limit : 20,
        };
        return this.auditService.findByEntity(entity, +entityId, pagination);
    }
    findByUser(userId, startDate, endDate, page, limit) {
        const filters = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        const pagination = {
            page: page ? +page : 1,
            limit: limit ? +limit : 20,
        };
        return this.auditService.findByUser(+userId, filters, pagination);
    }
    findOne(id) {
        return this.auditService.findOne(+id);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar logs de auditoria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de logs de auditoria' }),
    (0, swagger_1.ApiQuery)({ name: 'entity', required: false, description: 'Filtrar por entidade' }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false, description: 'Filtrar por ação' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filtrar por usuário' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Data inicial (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Data final (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Itens por página (padrão: 50)' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('entity')),
    __param(2, (0, common_1.Query)('action')),
    __param(3, (0, common_1.Query)('userId')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas de auditoria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas de auditoria' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Data inicial (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Data final (ISO)' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter logs por entidade' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logs da entidade' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Itens por página (padrão: 20)' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Get)('entity/:entity/:entityId'),
    __param(0, (0, common_1.Param)('entity')),
    __param(1, (0, common_1.Param)('entityId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findByEntity", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter logs por usuário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logs do usuário' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Data inicial (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Data final (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Itens por página (padrão: 20)' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findByUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter log específico por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Log de auditoria' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Log não encontrado' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findOne", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('audit'),
    (0, common_1.Controller)('audit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map