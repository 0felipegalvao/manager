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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const prisma_1 = require("../../generated/prisma");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(createTaskDto, user) {
        return this.tasksService.create(createTaskDto, user.id);
    }
    findAll(user, clientId, status, priority) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.tasksService.findAll(userId, clientId ? +clientId : undefined, status, priority ? +priority : undefined);
    }
    getStats(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.tasksService.getStats(userId);
    }
    findByStatus(status, user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.tasksService.findByStatus(status, userId);
    }
    findUpcoming(user, days) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.tasksService.findUpcoming(days ? +days : 7, userId);
    }
    findOverdue(user) {
        const userId = user.role === prisma_1.UserRole.ADMIN ? undefined : user.id;
        return this.tasksService.findOverdue(userId);
    }
    findOne(id) {
        return this.tasksService.findOne(+id);
    }
    update(id, updateTaskDto) {
        return this.tasksService.update(+id, updateTaskDto);
    }
    complete(id) {
        return this.tasksService.complete(+id);
    }
    remove(id) {
        return this.tasksService.remove(+id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova tarefa' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tarefa criada com sucesso' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as tarefas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de tarefas' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filtrar por status' }),
    (0, swagger_1.ApiQuery)({ name: 'priority', required: false, description: 'Filtrar por prioridade' }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clientId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas das tarefas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas das tarefas' }),
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar tarefas por status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefas filtradas por status' }),
    (0, common_1.Get)('by-status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar tarefas próximas ao vencimento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefas próximas ao vencimento' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Número de dias (padrão: 7)' }),
    (0, common_1.Get)('upcoming'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findUpcoming", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar tarefas atrasadas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefas atrasadas' }),
    (0, common_1.Get)('overdue'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOverdue", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter tarefa por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefa encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar tarefa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefa atualizada com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Marcar tarefa como concluída' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefa marcada como concluída' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "complete", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover tarefa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarefa removida com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarefa não encontrada' }),
    (0, roles_decorator_1.Roles)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.CONTADOR),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map