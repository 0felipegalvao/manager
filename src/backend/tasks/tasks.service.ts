import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
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

  async findAll(
    userId?: number,
    clientId?: number,
    status?: string,
    priority?: number,
  ) {
    const where: any = {};

    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

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

  async getStats(userId?: number) {
    const where = userId ? { userId } : {};

    const [
      total,
      pendentes,
      emAndamento,
      concluidas,
      canceladas,
      atrasadas,
      proximasVencimento,
    ] = await Promise.all([
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

  async findByStatus(status: string, userId?: number) {
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

  async findUpcoming(days: number, userId?: number) {
    const where: any = {
      status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
      dueDate: {
        gte: new Date(),
        lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    };

    if (userId) where.userId = userId;

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

  async findOverdue(userId?: number) {
    const where: any = {
      status: { in: ['PENDENTE', 'EM_ANDAMENTO'] },
      dueDate: { lt: new Date() },
    };

    if (userId) where.userId = userId;

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

  async findOne(id: number) {
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
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
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

  async complete(id: number) {
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

  async remove(id: number) {
    // Verificar se tarefa existe
    await this.findOne(id);

    const task = await this.prisma.task.delete({
      where: { id },
    });

    return task;
  }
}
