import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { UpdateObligationDto } from './dto/update-obligation.dto';

@Injectable()
export class FiscalService {
  constructor(private prisma: PrismaService) {}

  async createObligation(createObligationDto: CreateObligationDto) {
    const obligation = await this.prisma.obligation.create({
      data: createObligationDto,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
            taxRegime: true,
          },
        },
        tasks: true,
      },
    });

    return obligation;
  }

  async findAllObligations(clientId?: number) {
    const where = clientId ? { clientId } : {};

    const obligations = await this.prisma.obligation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
            taxRegime: true,
          },
        },
        tasks: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return obligations;
  }

  async findObligationById(id: number) {
    const obligation = await this.prisma.obligation.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
            taxRegime: true,
          },
        },
        tasks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!obligation) {
      throw new NotFoundException('Obrigação fiscal não encontrada');
    }

    return obligation;
  }

  async updateObligation(id: number, updateObligationDto: UpdateObligationDto) {
    // Verificar se obrigação existe
    await this.findObligationById(id);

    const obligation = await this.prisma.obligation.update({
      where: { id },
      data: updateObligationDto,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
            taxRegime: true,
          },
        },
        tasks: true,
      },
    });

    return obligation;
  }

  async removeObligation(id: number) {
    // Verificar se obrigação existe
    await this.findObligationById(id);

    const obligation = await this.prisma.obligation.delete({
      where: { id },
    });

    return obligation;
  }

  async getObligationStats(clientId?: number) {
    const where = clientId ? { clientId } : {};

    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      this.prisma.obligation.count({ where }),
      this.prisma.obligation.count({ where: { ...where, status: 'PENDENTE' } }),
      this.prisma.obligation.count({ where: { ...where, status: 'EM_ANDAMENTO' } }),
      this.prisma.obligation.count({ where: { ...where, status: 'CONCLUIDA' } }),
      this.prisma.obligation.count({ 
        where: { 
          ...where, 
          status: 'ATRASADA',
          dueDate: { lt: new Date() }
        } 
      }),
    ]);

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
    };
  }

  async getUpcomingObligations(days: number = 30, clientId?: number) {
    const where: any = {
      dueDate: {
        gte: new Date(),
        lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
      status: {
        in: ['PENDENTE', 'EM_ANDAMENTO'],
      },
    };

    if (clientId) {
      where.clientId = clientId;
    }

    return this.prisma.obligation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
            taxRegime: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getOverdueObligations(clientId?: number) {
    const where: any = {
      dueDate: { lt: new Date() },
      status: {
        in: ['PENDENTE', 'EM_ANDAMENTO'],
      },
    };

    if (clientId) {
      where.clientId = clientId;
    }

    return this.prisma.obligation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
            taxRegime: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getCalendarData(year: number, month: number, clientId?: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const where: any = {
      dueDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (clientId) {
      where.clientId = clientId;
    }

    return this.prisma.obligation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}
