import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
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

  async findAll(userId?: number) {
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

  async findUnread(userId: number) {
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

  async findOne(id: number) {
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
      throw new NotFoundException('Notificação não encontrada');
    }

    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
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

  async markAsRead(id: number) {
    return this.update(id, { read: true });
  }

  async markAllAsRead(userId: number) {
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

  async remove(id: number) {
    // Verificar se notificação existe
    await this.findOne(id);

    const notification = await this.prisma.notification.delete({
      where: { id },
    });

    return notification;
  }

  async getStats(userId?: number) {
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
      }, {} as Record<string, number>),
    };
  }

  // Método para criar notificações automáticas
  async createSystemNotification(
    userId: number,
    title: string,
    message: string,
    type: string = 'INFO',
  ) {
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
    const notifications = await Promise.all(
      upcomingObligations.map((obligation) =>
        this.createSystemNotification(
          obligation.client.userId,
          'Obrigação Fiscal Próxima ao Vencimento',
          `A obrigação "${obligation.name}" para ${obligation.client.razaoSocial} vence em ${new Date(obligation.dueDate).toLocaleDateString('pt-BR')}`,
          'WARNING',
        ),
      ),
    );

    return notifications;
  }
}
