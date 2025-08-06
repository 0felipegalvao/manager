import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  private getBackupPath(): string {
    const backupDir = process.env.BACKUP_PATH || './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    return backupDir;
  }

  async createDatabaseBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = this.getBackupPath();
      const filename = `db-backup-${timestamp}.sql`;
      const filepath = path.join(backupPath, filename);

      // Extrair informações da URL do banco
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL não configurada');
      }

      // Comando pg_dump para PostgreSQL
      const command = `pg_dump "${databaseUrl}" > "${filepath}"`;
      
      await execAsync(command);

      console.log(`✅ Backup do banco criado: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('❌ Erro ao criar backup do banco:', error);
      throw error;
    }
  }

  async createDocumentsBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = this.getBackupPath();
      const filename = `documents-backup-${timestamp}.tar.gz`;
      const filepath = path.join(backupPath, filename);

      const documentsPath = process.env.UPLOAD_PATH || './uploads';
      
      if (!fs.existsSync(documentsPath)) {
        console.log('📁 Diretório de documentos não existe, criando backup vazio');
        fs.writeFileSync(filepath, '');
        return filepath;
      }

      // Comando tar para compactar documentos
      const command = `tar -czf "${filepath}" -C "${path.dirname(documentsPath)}" "${path.basename(documentsPath)}"`;
      
      await execAsync(command);

      console.log(`✅ Backup dos documentos criado: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error('❌ Erro ao criar backup dos documentos:', error);
      throw error;
    }
  }

  async createFullBackup(): Promise<{ database: string; documents: string }> {
    try {
      console.log('🔄 Iniciando backup completo...');

      const [databaseBackup, documentsBackup] = await Promise.all([
        this.createDatabaseBackup(),
        this.createDocumentsBackup(),
      ]);

      // Registrar backup no banco
      await this.prisma.backupLog.create({
        data: {
          type: 'FULL',
          status: 'SUCCESS',
          databasePath: databaseBackup,
          documentsPath: documentsBackup,
          size: await this.getBackupSize([databaseBackup, documentsBackup]),
        },
      });

      console.log('✅ Backup completo finalizado com sucesso!');
      return { database: databaseBackup, documents: documentsBackup };
    } catch (error) {
      // Registrar falha no backup
      await this.prisma.backupLog.create({
        data: {
          type: 'FULL',
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      console.error('❌ Falha no backup completo:', error);
      throw error;
    }
  }

  async cleanupOldBackups(retentionDays: number = 30): Promise<void> {
    try {
      const backupPath = this.getBackupPath();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const files = fs.readdirSync(backupPath);
      let deletedCount = 0;

      for (const file of files) {
        const filepath = path.join(backupPath, file);
        const stats = fs.statSync(filepath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filepath);
          deletedCount++;
        }
      }

      // Limpar registros antigos do banco
      await this.prisma.backupLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      console.log(`🧹 Limpeza concluída: ${deletedCount} backups antigos removidos`);
    } catch (error) {
      console.error('❌ Erro na limpeza de backups:', error);
      throw error;
    }
  }

  async getBackupHistory(limit: number = 10) {
    return this.prisma.backupLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getBackupStats() {
    const [total, successful, failed, lastBackup] = await Promise.all([
      this.prisma.backupLog.count(),
      this.prisma.backupLog.count({ where: { status: 'SUCCESS' } }),
      this.prisma.backupLog.count({ where: { status: 'FAILED' } }),
      this.prisma.backupLog.findFirst({
        where: { status: 'SUCCESS' },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      lastBackup: lastBackup?.createdAt,
    };
  }

  private async getBackupSize(filepaths: string[]): Promise<number> {
    let totalSize = 0;
    
    for (const filepath of filepaths) {
      try {
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          totalSize += stats.size;
        }
      } catch (error) {
        console.warn(`Não foi possível obter tamanho do arquivo: ${filepath}`);
      }
    }

    return totalSize;
  }

  async restoreDatabase(backupPath: string): Promise<void> {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL não configurada');
      }

      if (!fs.existsSync(backupPath)) {
        throw new Error(`Arquivo de backup não encontrado: ${backupPath}`);
      }

      // Comando psql para restaurar PostgreSQL
      const command = `psql "${databaseUrl}" < "${backupPath}"`;
      
      await execAsync(command);

      console.log(`✅ Banco restaurado a partir de: ${backupPath}`);
    } catch (error) {
      console.error('❌ Erro ao restaurar banco:', error);
      throw error;
    }
  }

  async restoreDocuments(backupPath: string): Promise<void> {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Arquivo de backup não encontrado: ${backupPath}`);
      }

      const documentsPath = process.env.UPLOAD_PATH || './uploads';
      
      // Comando tar para extrair documentos
      const command = `tar -xzf "${backupPath}" -C "${path.dirname(documentsPath)}"`;
      
      await execAsync(command);

      console.log(`✅ Documentos restaurados a partir de: ${backupPath}`);
    } catch (error) {
      console.error('❌ Erro ao restaurar documentos:', error);
      throw error;
    }
  }

  // Método para teste manual
  async testBackup(): Promise<void> {
    try {
      console.log('🧪 Testando sistema de backup...');
      
      const result = await this.createFullBackup();
      const stats = await this.getBackupStats();
      
      console.log('📊 Estatísticas do backup:', stats);
      console.log('🧪 Teste de backup concluído com sucesso!');
    } catch (error) {
      console.error('❌ Falha no teste de backup:', error);
      throw error;
    }
  }
}
