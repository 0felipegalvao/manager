"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../generated/prisma");
let PrismaService = class PrismaService extends prisma_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        console.log('🗄️  Conectado ao banco PostgreSQL');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log('🗄️  Desconectado do banco PostgreSQL');
    }
    async cleanDatabase() {
        // Método para limpar o banco em testes
        if (process.env.NODE_ENV === 'test') {
            const tablenames = await this.$queryRaw `
        SELECT tablename FROM pg_tables WHERE schemaname='public'
      `;
            for (const { tablename } of tablenames) {
                if (tablename !== '_prisma_migrations') {
                    try {
                        await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
                    }
                    catch (error) {
                        console.log({ error });
                    }
                }
            }
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map