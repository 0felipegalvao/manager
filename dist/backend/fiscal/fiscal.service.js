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
exports.FiscalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let FiscalService = class FiscalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createObligation(createObligationDto) {
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
    async findAllObligations(clientId) {
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
    async findObligationById(id) {
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
            throw new common_1.NotFoundException('Obrigação fiscal não encontrada');
        }
        return obligation;
    }
    async updateObligation(id, updateObligationDto) {
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
    async removeObligation(id) {
        // Verificar se obrigação existe
        await this.findObligationById(id);
        const obligation = await this.prisma.obligation.delete({
            where: { id },
        });
        return obligation;
    }
    async getObligationStats(clientId) {
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
    async getUpcomingObligations(days = 30, clientId) {
        const where = {
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
    async getOverdueObligations(clientId) {
        const where = {
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
    async getCalendarData(year, month, clientId) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const where = {
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
};
exports.FiscalService = FiscalService;
exports.FiscalService = FiscalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FiscalService);
//# sourceMappingURL=fiscal.service.js.map