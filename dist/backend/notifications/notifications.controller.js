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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const update_notification_dto_1 = require("./dto/update-notification.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const prisma_1 = require("../../generated/prisma");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    create(createNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }
    findAll(user, userId) {
        // Se não for admin, só pode ver suas próprias notificações
        const targetUserId = user.role === prisma_1.UserRole.ADMIN && userId ? +userId : user.id;
        return this.notificationsService.findAll(targetUserId);
    }
    findUnread(user) {
        return this.notificationsService.findUnread(user.id);
    }
    getStats(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.notificationsService.getStats(userId);
    }
    markAllAsRead(user) {
        return this.notificationsService.markAllAsRead(user.id);
    }
    findOne(id) {
        return this.notificationsService.findOne(+id);
    }
    markAsRead(id) {
        return this.notificationsService.markAsRead(+id);
    }
    update(id, updateNotificationDto) {
        return this.notificationsService.update(+id, updateNotificationDto);
    }
    remove(id) {
        return this.notificationsService.remove(+id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova notificação' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notificação criada com sucesso' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as notificações' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de notificações' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filtrar por usuário' }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar notificações não lidas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificações não lidas' }),
    (0, common_1.Get)('unread'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findUnread", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas das notificações' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas das notificações' }),
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Marcar todas como lidas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificações marcadas como lidas' }),
    (0, common_1.Post)('mark-all-read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar notificação por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificação encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Marcar notificação como lida' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificação marcada como lida' }),
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar notificação' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificação atualizada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_notification_dto_1.UpdateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover notificação' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificação removida' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notificação não encontrada' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map