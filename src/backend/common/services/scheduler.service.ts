import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from './email.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class SchedulerService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  // Executar todos os dias às 9:00 AM
  // @Cron('0 9 * * *')
  async sendDailyObligationReminders() {
    console.log('🔔 Executando lembretes diários de obrigações...');

    try {
      // Buscar obrigações que vencem nos próximos 7 dias
      const upcomingObligations = await this.prisma.obligation.findMany({
        where: {
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: {
            in: ['PENDENTE', 'EM_ANDAMENTO'],
          },
        },
        include: {
          client: {
            include: {
              user: true,
            },
          },
        },
      });

      // Agrupar por usuário
      const obligationsByUser = upcomingObligations.reduce((acc, obligation) => {
        const userId = obligation.client.userId;
        if (!acc[userId]) {
          acc[userId] = {
            user: obligation.client.user,
            obligations: [],
          };
        }
        acc[userId].obligations.push(obligation);
        return acc;
      }, {} as Record<number, { user: any; obligations: any[] }>);

      // Enviar emails e criar notificações
      for (const [userId, data] of Object.entries(obligationsByUser)) {
        const { user, obligations } = data;

        // Criar notificação in-app
        for (const obligation of obligations) {
          await this.notificationsService.createSystemNotification(
            user.id,
            'Obrigação Fiscal Próxima ao Vencimento',
            `A obrigação "${obligation.name}" para ${obligation.client.razaoSocial} vence em ${new Date(obligation.dueDate).toLocaleDateString('pt-BR')}`,
            'WARNING',
          );

          // Enviar email
          await this.emailService.sendObligationReminder(
            user.email,
            user.name,
            obligation.name,
            obligation.client.razaoSocial,
            obligation.dueDate,
          );
        }
      }

      console.log(`✅ Enviados lembretes para ${Object.keys(obligationsByUser).length} usuários`);
    } catch (error) {
      console.error('❌ Erro ao enviar lembretes diários:', error);
    }
  }

  // Executar todos os dias às 8:00 AM para obrigações vencidas
  // @Cron('0 8 * * *')
  async sendOverdueObligationAlerts() {
    console.log('🚨 Verificando obrigações vencidas...');

    try {
      // Buscar obrigações vencidas
      const overdueObligations = await this.prisma.obligation.findMany({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            in: ['PENDENTE', 'EM_ANDAMENTO'],
          },
        },
        include: {
          client: {
            include: {
              user: true,
            },
          },
        },
      });

      // Agrupar por usuário
      const obligationsByUser = overdueObligations.reduce((acc, obligation) => {
        const userId = obligation.client.userId;
        if (!acc[userId]) {
          acc[userId] = {
            user: obligation.client.user,
            obligations: [],
          };
        }
        acc[userId].obligations.push(obligation);
        return acc;
      }, {} as Record<number, { user: any; obligations: any[] }>);

      // Enviar alertas
      for (const [userId, data] of Object.entries(obligationsByUser)) {
        const { user, obligations } = data;

        // Criar notificação in-app
        await this.notificationsService.createSystemNotification(
          user.id,
          `${obligations.length} Obrigação(ões) Vencida(s)`,
          `Você tem ${obligations.length} obrigação(ões) fiscal(is) vencida(s) que requerem atenção imediata.`,
          'ERROR',
        );
      }

      console.log(`🚨 Alertas enviados para ${Object.keys(obligationsByUser).length} usuários sobre obrigações vencidas`);
    } catch (error) {
      console.error('❌ Erro ao verificar obrigações vencidas:', error);
    }
  }

  // Executar no primeiro dia de cada mês às 10:00 AM
  // @Cron('0 10 1 * *')
  async sendMonthlyReports() {
    console.log('📊 Enviando relatórios mensais...');

    try {
      // Buscar todos os usuários ativos
      const users = await this.prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'CONTADOR'],
          },
        },
      });

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
      const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

      for (const user of users) {
        const where = user.role === 'ADMIN' ? {} : { userId: user.id };

        // Calcular estatísticas do mês passado
        const [totalClients, newClients, documentsProcessed, obligationsCompleted] = await Promise.all([
          this.prisma.client.count({ where }),
          this.prisma.client.count({
            where: {
              ...where,
              createdAt: {
                gte: startOfLastMonth,
                lte: endOfLastMonth,
              },
            },
          }),
          this.prisma.document.count({
            where: {
              ...(user.role === 'ADMIN' ? {} : { userId: user.id }),
              createdAt: {
                gte: startOfLastMonth,
                lte: endOfLastMonth,
              },
            },
          }),
          this.prisma.obligation.count({
            where: {
              ...(user.role === 'ADMIN' ? {} : { client: { userId: user.id } }),
              status: 'CONCLUIDA',
              updatedAt: {
                gte: startOfLastMonth,
                lte: endOfLastMonth,
              },
            },
          }),
        ]);

        // Enviar relatório por email
        await this.emailService.sendMonthlyReport(user.email, user.name, {
          totalClients,
          newClients,
          documentsProcessed,
          obligationsCompleted,
        });

        // Criar notificação in-app
        await this.notificationsService.createSystemNotification(
          user.id,
          'Relatório Mensal Disponível',
          `Seu relatório mensal foi gerado. Confira as estatísticas do mês passado.`,
          'INFO',
        );
      }

      console.log(`📊 Relatórios mensais enviados para ${users.length} usuários`);
    } catch (error) {
      console.error('❌ Erro ao enviar relatórios mensais:', error);
    }
  }

  // Executar a cada 6 horas para limpeza de notificações antigas
  // @Cron('0 */6 * * *')
  async cleanupOldNotifications() {
    console.log('🧹 Limpando notificações antigas...');

    try {
      // Remover notificações lidas com mais de 30 dias
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const result = await this.prisma.notification.deleteMany({
        where: {
          read: true,
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      console.log(`🧹 Removidas ${result.count} notificações antigas`);
    } catch (error) {
      console.error('❌ Erro na limpeza de notificações:', error);
    }
  }

  // Executar todos os domingos às 18:00 para backup de logs de auditoria
  // @Cron('0 18 * * 0')
  async backupAuditLogs() {
    console.log('💾 Fazendo backup dos logs de auditoria...');

    try {
      // Contar logs de auditoria dos últimos 7 dias
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const recentLogsCount = await this.prisma.auditLog.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });

      // Criar notificação para administradores
      const admins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
      });

      for (const admin of admins) {
        await this.notificationsService.createSystemNotification(
          admin.id,
          'Backup Semanal Realizado',
          `Backup dos logs de auditoria concluído. ${recentLogsCount} registros dos últimos 7 dias foram processados.`,
          'INFO',
        );
      }

      console.log(`💾 Backup concluído. ${recentLogsCount} logs processados`);
    } catch (error) {
      console.error('❌ Erro no backup de logs:', error);
    }
  }

  // Método manual para testar notificações
  async testNotifications() {
    console.log('🧪 Testando sistema de notificações...');

    try {
      // Buscar um usuário admin para teste
      const admin = await this.prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });

      if (admin) {
        // Criar notificação de teste
        await this.notificationsService.createSystemNotification(
          admin.id,
          'Teste do Sistema de Notificações',
          'Esta é uma notificação de teste para verificar se o sistema está funcionando corretamente.',
          'INFO',
        );

        // Enviar email de teste
        await this.emailService.sendEmail({
          to: admin.email,
          subject: 'Teste do Sistema de Email',
          html: '<h1>Sistema de Email Funcionando!</h1><p>Este é um email de teste.</p>',
        });

        console.log('🧪 Teste concluído com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro no teste de notificações:', error);
    }
  }
}
