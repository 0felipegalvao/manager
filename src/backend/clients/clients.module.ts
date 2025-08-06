import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsImportService } from './clients-import.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, ClientsImportService, PrismaService],
  exports: [ClientsService, ClientsImportService],
})
export class ClientsModule {}
