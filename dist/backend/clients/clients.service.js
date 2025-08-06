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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let ClientsService = class ClientsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createClientDto, userId) {
        // Verificar se CNPJ já existe
        const existingClient = await this.prisma.client.findUnique({
            where: { cnpj: createClientDto.cnpj },
        });
        if (existingClient) {
            throw new common_1.ConflictException('CNPJ já está cadastrado');
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
    async findAll(userId) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Cliente não encontrado');
        }
        return client;
    }
    async findByCnpj(cnpj) {
        return this.prisma.client.findUnique({
            where: { cnpj },
        });
    }
    async update(id, updateClientDto) {
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
                throw new common_1.ConflictException('CNPJ já está cadastrado para outro cliente');
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
    async remove(id) {
        // Verificar se cliente existe
        await this.findOne(id);
        // Remover cliente (cascade irá remover relacionamentos)
        const client = await this.prisma.client.delete({
            where: { id },
        });
        return client;
    }
    async getStats(userId) {
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
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map