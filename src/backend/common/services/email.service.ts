import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.createTransporter();
  }

  private createTransporter() {
    // Configuração para desenvolvimento (usando Ethereal Email para testes)
    if (process.env.NODE_ENV === 'development') {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass',
        },
      });
    } else {
      // Configuração para produção (Gmail, SendGrid, etc.)
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@gestaocontabil.com',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Email enviado:', nodemailer.getTestMessageUrl(info));
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  // Templates de email específicos
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Bem-vindo ao Sistema de Gestão Contábil!</h1>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>Sua conta foi criada com sucesso. Agora você pode acessar todas as funcionalidades do sistema.</p>
        <p>Para começar, faça login em: <a href="${process.env.FRONTEND_URL}/login">Acessar Sistema</a></p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este é um email automático, não responda esta mensagem.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Bem-vindo ao Sistema de Gestão Contábil',
      html,
    });
  }

  async sendObligationReminder(
    userEmail: string,
    userName: string,
    obligationName: string,
    clientName: string,
    dueDate: Date
  ): Promise<boolean> {
    const formattedDate = dueDate.toLocaleDateString('pt-BR');
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">⚠️ Lembrete de Obrigação Fiscal</h1>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>Este é um lembrete sobre uma obrigação fiscal próxima ao vencimento:</p>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0; color: #dc2626;">${obligationName}</h3>
          <p style="margin: 4px 0;"><strong>Cliente:</strong> ${clientName}</p>
          <p style="margin: 4px 0;"><strong>Data de Vencimento:</strong> ${formattedDate}</p>
        </div>
        
        <p>Acesse o sistema para mais detalhes: <a href="${process.env.FRONTEND_URL}/fiscal">Ver Calendário Fiscal</a></p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este é um email automático, não responda esta mensagem.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Lembrete: ${obligationName} - Vence em ${formattedDate}`,
      html,
    });
  }

  async sendDocumentProcessed(
    userEmail: string,
    userName: string,
    documentName: string,
    clientName: string,
    status: string
  ): Promise<boolean> {
    const statusColor = status === 'APROVADO' ? '#16a34a' : '#dc2626';
    const statusText = status === 'APROVADO' ? 'aprovado' : 'rejeitado';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${statusColor};">Documento ${statusText}</h1>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>O documento foi processado com o seguinte resultado:</p>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin: 0 0 8px 0;">${documentName}</h3>
          <p style="margin: 4px 0;"><strong>Cliente:</strong> ${clientName}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: ${statusColor};">${status}</span></p>
        </div>
        
        <p>Acesse o sistema para mais detalhes: <a href="${process.env.FRONTEND_URL}/documents">Ver Documentos</a></p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este é um email automático, não responda esta mensagem.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Documento ${statusText}: ${documentName}`,
      html,
    });
  }

  async sendPasswordReset(userEmail: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Redefinição de Senha</h1>
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Redefinir Senha
          </a>
        </div>
        
        <p style="color: #666;">Este link expira em 1 hora.</p>
        <p style="color: #666;">Se você não solicitou esta redefinição, ignore este email.</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este é um email automático, não responda esta mensagem.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Redefinição de Senha - Sistema de Gestão Contábil',
      html,
    });
  }

  async sendMonthlyReport(
    userEmail: string,
    userName: string,
    reportData: {
      totalClients: number;
      newClients: number;
      documentsProcessed: number;
      obligationsCompleted: number;
    }
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">📊 Relatório Mensal</h1>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>Aqui está o resumo das atividades do mês:</p>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #2563eb; font-size: 24px;">${reportData.totalClients}</h3>
              <p style="margin: 4px 0; color: #666;">Total de Clientes</p>
            </div>
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #16a34a; font-size: 24px;">${reportData.newClients}</h3>
              <p style="margin: 4px 0; color: #666;">Novos Clientes</p>
            </div>
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #dc2626; font-size: 24px;">${reportData.documentsProcessed}</h3>
              <p style="margin: 4px 0; color: #666;">Documentos Processados</p>
            </div>
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #7c3aed; font-size: 24px;">${reportData.obligationsCompleted}</h3>
              <p style="margin: 4px 0; color: #666;">Obrigações Concluídas</p>
            </div>
          </div>
        </div>
        
        <p>Acesse o sistema para ver o relatório completo: <a href="${process.env.FRONTEND_URL}/reports">Ver Relatórios</a></p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este é um email automático, não responda esta mensagem.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Relatório Mensal - Sistema de Gestão Contábil',
      html,
    });
  }
}
