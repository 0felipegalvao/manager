import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { DocumentsModule } from './documents/documents.module';
import { FiscalModule } from './fiscal/fiscal.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { EmailService } from './common/services/email.service';
import { SchedulerService } from './common/services/scheduler.service';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ClientsModule,
    DocumentsModule,
    FiscalModule,
    NotificationsModule,
    ReportsModule,
  ],
  providers: [EmailService, SchedulerService, PrismaService],
  controllers: [],
})
export class AppModule {}
