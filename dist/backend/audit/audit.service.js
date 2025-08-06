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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters, pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.entity)
            where.entity = filters.entity;
        if (filters.action)
            where.action = filters.action;
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getStats(filters) {
        const where = {};
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [total, byAction, byEntity, byUser, recentActivity,] = await Promise.all([
            this.prisma.auditLog.count({ where }),
            this.prisma.auditLog.groupBy({
                by: ['action'],
                where,
                _count: { action: true },
                orderBy: { _count: { action: 'desc' } },
            }),
            this.prisma.auditLog.groupBy({
                by: ['entity'],
                where,
                _count: { entity: true },
                orderBy: { _count: { entity: 'desc' } },
            }),
            this.prisma.auditLog.groupBy({
                by: ['userId'],
                where,
                _count: { userId: true },
                orderBy: { _count: { userId: 'desc' } },
                take: 10,
            }),
            this.prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        // Buscar nomes dos usuários para estatísticas
        const userIds = byUser.map(u => u.userId).filter(Boolean);
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true },
        });
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});
        const byUserWithNames = byUser.map(stat => ({
            ...stat,
            user: stat.userId ? userMap[stat.userId] : null,
        }));
        return {
            total,
            byAction: byAction.map(stat => ({
                action: stat.action,
                count: stat._count.action,
            })),
            byEntity: byEntity.map(stat => ({
                entity: stat.entity,
                count: stat._count.entity,
            })),
            byUser: byUserWithNames.map(stat => ({
                userId: stat.userId,
                user: stat.user,
                count: stat._count.userId,
            })),
            recentActivity,
        };
    }
    async findByEntity(entity, entityId, pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const where = { entity };
        // Adicionar filtro por entityId baseado na entidade
        switch (entity.toLowerCase()) {
            case 'client':
                where.clientId = entityId;
                break;
            case 'document':
                where.documentId = entityId;
                break;
            case 'obligation':
                where.obligationId = entityId;
                break;
            case 'user':
                where.userId = entityId;
                break;
            default:
                where.entityId = entityId;
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findByUser(userId, filters, pagination) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate)
                where.createdAt.gte = filters.startDate;
            if (filters.endDate)
                where.createdAt.lte = filters.endDate;
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        razaoSocial: true,
                        cnpj: true,
                    },
                },
                document: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
                obligation: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
            },
        });
        if (!log) {
            throw new common_1.NotFoundException('Log de auditoria não encontrado');
        }
        return log;
    }
    // Método para criar logs de auditoria (usado pelo interceptor)
    async createLog(data) {
        return this.prisma.auditLog.create({
            data,
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map