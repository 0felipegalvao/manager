import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentDto: CreateDocumentDto, userId: number) {
    const document = await this.prisma.document.create({
      data: {
        ...createDocumentDto,
        userId,
      },
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return document;
  }

  async findAll(clientId?: number, userId?: number) {
    const where: any = {};
    
    if (clientId) {
      where.clientId = clientId;
    }
    
    if (userId) {
      where.userId = userId;
    }

    const documents = await this.prisma.document.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
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

    return documents;
  }

  async findOne(id: number) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    // Verificar se documento existe
    await this.findOne(id);

    const document = await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return document;
  }

  async remove(id: number) {
    // Verificar se documento existe
    await this.findOne(id);

    const document = await this.prisma.document.delete({
      where: { id },
    });

    return document;
  }

  async getStats(clientId?: number, userId?: number) {
    const where: any = {};
    
    if (clientId) {
      where.clientId = clientId;
    }
    
    if (userId) {
      where.userId = userId;
    }

    const [total, pending, approved, rejected, archived] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.count({ where: { ...where, status: 'PENDENTE' } }),
      this.prisma.document.count({ where: { ...where, status: 'APROVADO' } }),
      this.prisma.document.count({ where: { ...where, status: 'REJEITADO' } }),
      this.prisma.document.count({ where: { ...where, status: 'ARQUIVADO' } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      archived,
    };
  }

  async findByType(type: string, clientId?: number) {
    const where: any = { type };
    
    if (clientId) {
      where.clientId = clientId;
    }

    return this.prisma.document.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            razaoSocial: true,
            cnpj: true,
          },
        },
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
  }
}
