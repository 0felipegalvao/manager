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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTaskDto, userId) {
        const task = await this.prisma.task.create({
            data: {
                ...createTaskDto,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
        });
        return task;
    }
    async findAll(userId, clientId, status, priority) {
        const where = {};
        if (userId)
            where.userId = userId;
        if (clientId)
            where.clientId = clientId;
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        const tasks = await this.prisma.task.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
            orderBy: [
                { priority: 'desc' },
                { dueDate: 'asc' },
                { createdAt: 'desc' },
            ],
        });
        return tasks;
    }
    async getStats(userId) {
        const where = userId ? { userId } : {};
        const [total, pendentes, emAndamento, concluidas, canceladas, atrasadas, proximasVencimento,] = await Promise.all([
            this.prisma.task.count({ where }),
            this.prisma.task.count({ where: { ...where, status: 'PENDENTE' } }),
            this.prisma.task.count({ where: { ...where, status: 'EM_ANDAMENTO' } }),
            this.prisma.task.count({ where: { ...where, status: 'CONCLUIDA' } }),
            this.prisma.task.count({ where: { ...where, status: 'CANCELADA' } }),
            this.prisma.task.count({
                where: {
                    ...where,
                    status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
                    dueDate: { lt: new Date() },
                },
            }),
            this.prisma.task.count({
                where: {
                    ...where,
                    status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
                    dueDate: {
                        gte: new Date(),
                        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
                    },
                },
            }),
        ]);
        return {
            total,
            pendentes,
            emAndamento,
            concluidas,
            canceladas,
            atrasadas,
            proximasVencimento,
            percentualConclusao: total > 0 ? Math.round((concluidas / total) * 100) : 0,
        };
    }
    async findByStatus(status, userId) {
        const where = userId ? { userId, status } : { status };
        const tasks = await this.prisma.task.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
            orderBy: [
                { priority: 'desc' },
                { dueDate: 'asc' },
            ],
        });
        return tasks;
    }
    async findUpcoming(days, userId) {
        const where = {
            status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
            dueDate: {
                gte: new Date(),
                lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            },
        };
        if (userId)
            where.userId = userId;
        const tasks = await this.prisma.task.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });
        return tasks;
    }
    async findOverdue(userId) {
        const where = {
            status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
            dueDate: { lt: new Date() },
        };
        if (userId)
            where.userId = userId;
        const tasks = await this.prisma.task.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });
        return tasks;
    }
    async findOne(id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Tarefa não encontrada');
        }
        return task;
    }
    async update(id, updateTaskDto) {
        // Verificar se tarefa existe
        await this.findOne(id);
        const task = await this.prisma.task.update({
            where: { id },
            data: updateTaskDto,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
        });
        return task;
    }
    async complete(id) {
        // Verificar se tarefa existe
        await this.findOne(id);
        const task = await this.prisma.task.update({
            where: { id },
            data: {
                status: 'CONCLUIDA',
                completedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        dueDate: true,
                    },
                },
            },
        });
        return task;
    }
    async remove(id) {
        // Verificar se tarefa existe
        await this.findOne(id);
        const task = await this.prisma.task.delete({
            where: { id },
        });
        return task;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map