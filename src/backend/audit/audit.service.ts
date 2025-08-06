import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

interface AuditFilters {
  entity?: string;
  action?: string;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
}

interface Pagination {
  page: number;
  limit: number;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: AuditFilters, pagination: Pagination) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.entity) where.entity = filters.entity;
    if (filters.action) where.action = filters.action;
    if (filters.userId) where.userId = filters.userId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
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

  async getStats(filters: { startDate?: Date; endDate?: Date }) {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [
      total,
      byAction,
      byEntity,
      byUser,
      recentActivity,
    ] = await Promise.all([
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
    }, {} as Record<number, any>);

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

  async findByEntity(entity: string, entityId: number, pagination: Pagination) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = { entity };

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

  async findByUser(
    userId: number,
    filters: { startDate?: Date; endDate?: Date },
    pagination: Pagination,
  ) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
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

  async findOne(id: number) {
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
      throw new NotFoundException('Log de auditoria não encontrado');
    }

    return log;
  }

  // Método para criar logs de auditoria (usado pelo interceptor)
  async createLog(data: {
    action: string;
    entity: string;
    entityId?: number;
    oldValues?: any;
    newValues?: any;
    userId?: number;
    ipAddress?: string;
    userAgent?: string;
    clientId?: number;
    documentId?: number;
    obligationId?: number;
  }) {
    return this.prisma.auditLog.create({
      data,
    });
  }
}
