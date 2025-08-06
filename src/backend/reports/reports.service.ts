import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId?: number) {
    const where = userId ? { userId } : {};

    const [
      totalClients,
      activeClients,
      totalDocuments,
      pendingObligations,
      overdueObligations,
      totalNotifications,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.count({ where: { ...where, status: 'ATIVO' } }),
      this.prisma.document.count({ where: userId ? { userId } : {} }),
      this.prisma.obligation.count({
        where: {
          ...(userId ? { client: { userId } } : {}),
          status: 'PENDENTE',
        },
      }),
      this.prisma.obligation.count({
        where: {
          ...(userId ? { client: { userId } } : {}),
          dueDate: { lt: new Date() },
          status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
        },
      }),
      this.prisma.notification.count({ where: userId ? { userId } : {} }),
      this.prisma.notification.count({
        where: { ...(userId ? { userId } : {}), read: false },
      }),
    ]);

    return {
      clients: {
        total: totalClients,
        active: activeClients,
        inactive: totalClients - activeClients,
      },
      documents: {
        total: totalDocuments,
      },
      obligations: {
        pending: pendingObligations,
        overdue: overdueObligations,
      },
      notifications: {
        total: totalNotifications,
        unread: unreadNotifications,
      },
    };
  }

  async getClientsByStatus(userId?: number) {
    const where = userId ? { userId } : {};

    const clientsByStatus = await this.prisma.client.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    return clientsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  async getClientsByTaxRegime(userId?: number) {
    const where = userId ? { userId } : {};

    const clientsByRegime = await this.prisma.client.groupBy({
      by: ['taxRegime'],
      where,
      _count: {
        taxRegime: true,
      },
    });

    return clientsByRegime.map((item) => ({
      regime: item.taxRegime,
      count: item._count.taxRegime,
    }));
  }

  async getDocumentsByType(userId?: number) {
    const where = userId ? { userId } : {};

    const documentsByType = await this.prisma.document.groupBy({
      by: ['type'],
      where,
      _count: {
        type: true,
      },
    });

    return documentsByType.map((item) => ({
      type: item.type,
      count: item._count.type,
    }));
  }

  async getDocumentsByStatus(userId?: number) {
    const where = userId ? { userId } : {};

    const documentsByStatus = await this.prisma.document.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    return documentsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  async getObligationsByStatus(userId?: number) {
    const where = userId ? { client: { userId } } : {};

    const obligationsByStatus = await this.prisma.obligation.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    return obligationsByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  async getObligationsByType(userId?: number) {
    const where = userId ? { client: { userId } } : {};

    const obligationsByType = await this.prisma.obligation.groupBy({
      by: ['type'],
      where,
      _count: {
        type: true,
      },
    });

    return obligationsByType.map((item) => ({
      type: item.type,
      count: item._count.type,
    }));
  }

  async getMonthlyStats(year: number, userId?: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const where = userId ? { userId } : {};
    const obligationWhere = userId ? { client: { userId } } : {};

    const [clientsCreated, documentsCreated, obligationsCreated] = await Promise.all([
      this.prisma.client.findMany({
        where: {
          ...where,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
      this.prisma.document.findMany({
        where: {
          ...where,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
      this.prisma.obligation.findMany({
        where: {
          ...obligationWhere,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    // Agrupar por mês
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      monthName: new Date(year, index).toLocaleString('pt-BR', { month: 'long' }),
      clients: 0,
      documents: 0,
      obligations: 0,
    }));

    clientsCreated.forEach((client) => {
      const month = client.createdAt.getMonth();
      monthlyData[month].clients++;
    });

    documentsCreated.forEach((document) => {
      const month = document.createdAt.getMonth();
      monthlyData[month].documents++;
    });

    obligationsCreated.forEach((obligation) => {
      const month = obligation.createdAt.getMonth();
      monthlyData[month].obligations++;
    });

    return monthlyData;
  }

  async getTopClients(limit: number = 10, userId?: number) {
    const where = userId ? { userId } : {};

    const clients = await this.prisma.client.findMany({
      where,
      include: {
        _count: {
          select: {
            documents: true,
            obligations: true,
            tasks: true,
          },
        },
      },
      orderBy: [
        { documents: { _count: 'desc' } },
        { obligations: { _count: 'desc' } },
      ],
      take: limit,
    });

    return clients.map((client) => ({
      id: client.id,
      razaoSocial: client.razaoSocial,
      cnpj: client.cnpj,
      status: client.status,
      taxRegime: client.taxRegime,
      documentsCount: client._count.documents,
      obligationsCount: client._count.obligations,
      tasksCount: client._count.tasks,
      totalActivity: client._count.documents + client._count.obligations + client._count.tasks,
    }));
  }

  async getRevenueReport(year: number, userId?: number) {
    const where = userId ? { userId } : {};

    const clients = await this.prisma.client.findMany({
      where: {
        ...where,
        valorMensal: { not: null },
      },
      select: {
        valorMensal: true,
        createdAt: true,
        status: true,
      },
    });

    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      monthName: new Date(year, index).toLocaleString('pt-BR', { month: 'long' }),
      revenue: 0,
      activeClients: 0,
    }));

    clients.forEach((client) => {
      if (client.status === 'ATIVO' && client.valorMensal) {
        const revenue = Number(client.valorMensal);

        // Adicionar receita para todos os meses desde a criação do cliente
        const startMonth = client.createdAt.getFullYear() === year ? client.createdAt.getMonth() : 0;

        for (let month = startMonth; month < 12; month++) {
          monthlyRevenue[month].revenue += revenue;
          monthlyRevenue[month].activeClients++;
        }
      }
    });

    const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
    const averageRevenue = totalRevenue / 12;

    return {
      year,
      totalRevenue,
      averageRevenue,
      monthlyData: monthlyRevenue,
    };
  }
}
