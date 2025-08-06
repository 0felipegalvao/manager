import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
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
      const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
      `;

      for (const { tablename } of tablenames) {
        if (tablename !== '_prisma_migrations') {
          try {
            await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
          } catch (error) {
            console.log({ error });
          }
        }
      }
    }
  }
}
