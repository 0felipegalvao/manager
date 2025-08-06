import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, userId: number) {
    // Verificar se CNPJ já existe
    const existingClient = await this.prisma.client.findUnique({
      where: { cnpj: createClientDto.cnpj },
    });

    if (existingClient) {
      throw new ConflictException('CNPJ já está cadastrado');
    }

    // Criar cliente
    const client = await this.prisma.client.create({
      data: {
        ...createClientDto,
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
        contacts: true,
        _count: {
          select: {
            documents: true,
            obligations: true,
            tasks: true,
          },
        },
      },
    });

    return client;
  }

  async findAll(userId?: number) {
    const where = userId ? { userId } : {};

    const clients = await this.prisma.client.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contacts: true,
        _count: {
          select: {
            documents: true,
            obligations: true,
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return clients;
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contacts: true,
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        obligations: {
          orderBy: { dueDate: 'asc' },
          take: 10,
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            documents: true,
            obligations: true,
            tasks: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return client;
  }

  async findByCnpj(cnpj: string) {
    return this.prisma.client.findUnique({
      where: { cnpj },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    // Verificar se cliente existe
    await this.findOne(id);

    // Se está atualizando CNPJ, verificar se não existe outro cliente com o mesmo CNPJ
    if (updateClientDto.cnpj) {
      const existingClient = await this.prisma.client.findFirst({
        where: {
          cnpj: updateClientDto.cnpj,
          NOT: { id },
        },
      });

      if (existingClient) {
        throw new ConflictException('CNPJ já está cadastrado para outro cliente');
      }
    }

    // Atualizar cliente
    const client = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contacts: true,
        _count: {
          select: {
            documents: true,
            obligations: true,
            tasks: true,
          },
        },
      },
    });

    return client;
  }

  async remove(id: number) {
    // Verificar se cliente existe
    await this.findOne(id);

    // Remover cliente (cascade irá remover relacionamentos)
    const client = await this.prisma.client.delete({
      where: { id },
    });

    return client;
  }

  async getStats(userId?: number) {
    const where = userId ? { userId } : {};

    const [total, active, inactive, suspended] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.count({ where: { ...where, status: 'ATIVO' } }),
      this.prisma.client.count({ where: { ...where, status: 'INATIVO' } }),
      this.prisma.client.count({ where: { ...where, status: 'SUSPENSO' } }),
    ]);

    return {
      total,
      active,
      inactive,
      suspended,
    };
  }
}
