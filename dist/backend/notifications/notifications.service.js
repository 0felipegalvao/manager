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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createNotificationDto) {
        const notification = await this.prisma.notification.create({
            data: createNotificationDto,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return notification;
    }
    async findAll(userId) {
        const where = userId ? { userId } : {};
        const notifications = await this.prisma.notification.findMany({
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
        });
        return notifications;
    }
    async findUnread(userId) {
        const notifications = await this.prisma.notification.findMany({
            where: {
                userId,
                read: false,
            },
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
        });
        return notifications;
    }
    async findOne(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notificação não encontrada');
        }
        return notification;
    }
    async update(id, updateNotificationDto) {
        // Verificar se notificação existe
        await this.findOne(id);
        const notification = await this.prisma.notification.update({
            where: { id },
            data: updateNotificationDto,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return notification;
    }
    async markAsRead(id) {
        return this.update(id, { read: true });
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
            },
        });
        return { updated: result.count };
    }
    async remove(id) {
        // Verificar se notificação existe
        await this.findOne(id);
        const notification = await this.prisma.notification.delete({
            where: { id },
        });
        return notification;
    }
    async getStats(userId) {
        const where = userId ? { userId } : {};
        const [total, unread, byType] = await Promise.all([
            this.prisma.notification.count({ where }),
            this.prisma.notification.count({ where: { ...where, read: false } }),
            this.prisma.notification.groupBy({
                by: ['type'],
                where,
                _count: {
                    type: true,
                },
            }),
        ]);
        return {
            total,
            unread,
            read: total - unread,
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count.type;
                return acc;
            }, {}),
        };
    }
    // Método para criar notificações automáticas
    async createSystemNotification(userId, title, message, type = 'INFO') {
        return this.create({
            userId,
            title,
            message,
            type,
        });
    }
    // Método para notificar sobre vencimentos
    async notifyUpcomingDeadlines() {
        // Buscar obrigações próximas ao vencimento (próximos 7 dias)
        const upcomingObligations = await this.prisma.obligation.findMany({
            where: {
                dueDate: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
                status: {
                    in: ['PENDENTE', 'EM_ANDAMENTO'],
                },
            },
            include: {
                client: {
                    select: {
                        razaoSocial: true,
                        userId: true,
                    },
                },
            },
        });
        // Criar notificações para cada obrigação
        const notifications = await Promise.all(upcomingObligations.map((obligation) => this.createSystemNotification(obligation.client.userId, 'Obrigação Fiscal Próxima ao Vencimento', `A obrigação "${obligation.name}" para ${obligation.client.razaoSocial} vence em ${new Date(obligation.dueDate).toLocaleDateString('pt-BR')}`, 'WARNING')));
        return notifications;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map