"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    constructor() {
        this.createTransporter();
    }
    createTransporter() {
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
        }
        else {
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
    async sendEmail(options) {
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
        }
        catch (error) {
            console.error('Erro ao enviar email:', error);
            return false;
        }
    }
    // Templates de email específicos
    async sendWelcomeEmail(userEmail, userName) {
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
    async sendObligationReminder(userEmail, userName, obligationName, clientName, dueDate) {
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
    async sendDocumentProcessed(userEmail, userName, documentName, clientName, status) {
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
    async sendPasswordReset(userEmail, resetToken) {
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
    async sendMonthlyReport(userEmail, userName, reportData) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map