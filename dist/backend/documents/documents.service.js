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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let DocumentsService = class DocumentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDocumentDto, userId) {
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
    async findAll(clientId, userId) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Documento não encontrado');
        }
        return document;
    }
    async update(id, updateDocumentDto) {
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
    async remove(id) {
        // Verificar se documento existe
        await this.findOne(id);
        const document = await this.prisma.document.delete({
            where: { id },
        });
        return document;
    }
    async getStats(clientId, userId) {
        const where = {};
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
    async findByType(type, clientId) {
        const where = { type };
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
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map