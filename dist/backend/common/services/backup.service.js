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
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let BackupService = class BackupService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getBackupPath() {
        const backupDir = process.env.BACKUP_PATH || './backups';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        return backupDir;
    }
    async createDatabaseBackup() {
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
        }
        catch (error) {
            console.error('❌ Erro ao criar backup do banco:', error);
            throw error;
        }
    }
    async createDocumentsBackup() {
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
        }
        catch (error) {
            console.error('❌ Erro ao criar backup dos documentos:', error);
            throw error;
        }
    }
    async createFullBackup() {
        try {
            console.log('🔄 Iniciando backup completo...');
            const [databaseBackup, documentsBackup] = await Promise.all([
                this.createDatabaseBackup(),
                this.createDocumentsBackup(),
            ]);
            // Registrar backup no banco (comentado - modelo BackupLog não existe)
            // await this.prisma.backupLog.create({
            //   data: {
            //     type: 'FULL',
            //     status: 'SUCCESS',
            //     databasePath: databaseBackup,
            //     documentsPath: documentsBackup,
            //     size: await this.getBackupSize([databaseBackup, documentsBackup]),
            //   },
            // });
            console.log('✅ Backup completo finalizado com sucesso!');
            return { database: databaseBackup, documents: documentsBackup };
        }
        catch (error) {
            // Registrar falha no backup (comentado - modelo BackupLog não existe)
            // await this.prisma.backupLog.create({
            //   data: {
            //     type: 'FULL',
            //     status: 'FAILED',
            //     errorMessage: error.message,
            //   },
            // });
            console.error('❌ Falha no backup completo:', error);
            throw error;
        }
    }
    async cleanupOldBackups(retentionDays = 30) {
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
            // Limpar registros antigos do banco (comentado - modelo BackupLog não existe)
            // await this.prisma.backupLog.deleteMany({
            //   where: {
            //     createdAt: {
            //       lt: cutoffDate,
            //     },
            //   },
            // });
            console.log(`🧹 Limpeza concluída: ${deletedCount} backups antigos removidos`);
        }
        catch (error) {
            console.error('❌ Erro na limpeza de backups:', error);
            throw error;
        }
    }
    async getBackupHistory(limit = 10) {
        // Comentado - modelo BackupLog não existe
        // return this.prisma.backupLog.findMany({
        //   orderBy: { createdAt: 'desc' },
        //   take: limit,
        // });
        return [];
    }
    async getBackupStats() {
        // Comentado - modelo BackupLog não existe
        // const [total, successful, failed, lastBackup] = await Promise.all([
        //   this.prisma.backupLog.count(),
        //   this.prisma.backupLog.count({ where: { status: 'SUCCESS' } }),
        //   this.prisma.backupLog.count({ where: { status: 'FAILED' } }),
        //   this.prisma.backupLog.findFirst({
        //     where: { status: 'SUCCESS' },
        //     orderBy: { createdAt: 'desc' },
        //   }),
        // ]);
        const [total, successful, failed, lastBackup] = [0, 0, 0, null];
        return {
            total,
            successful,
            failed,
            successRate: total > 0 ? (successful / total) * 100 : 0,
            lastBackup: lastBackup?.createdAt,
        };
    }
    async getBackupSize(filepaths) {
        let totalSize = 0;
        for (const filepath of filepaths) {
            try {
                if (fs.existsSync(filepath)) {
                    const stats = fs.statSync(filepath);
                    totalSize += stats.size;
                }
            }
            catch (error) {
                console.warn(`Não foi possível obter tamanho do arquivo: ${filepath}`);
            }
        }
        return totalSize;
    }
    async restoreDatabase(backupPath) {
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
        }
        catch (error) {
            console.error('❌ Erro ao restaurar banco:', error);
            throw error;
        }
    }
    async restoreDocuments(backupPath) {
        try {
            if (!fs.existsSync(backupPath)) {
                throw new Error(`Arquivo de backup não encontrado: ${backupPath}`);
            }
            const documentsPath = process.env.UPLOAD_PATH || './uploads';
            // Comando tar para extrair documentos
            const command = `tar -xzf "${backupPath}" -C "${path.dirname(documentsPath)}"`;
            await execAsync(command);
            console.log(`✅ Documentos restaurados a partir de: ${backupPath}`);
        }
        catch (error) {
            console.error('❌ Erro ao restaurar documentos:', error);
            throw error;
        }
    }
    // Método para teste manual
    async testBackup() {
        try {
            console.log('🧪 Testando sistema de backup...');
            const result = await this.createFullBackup();
            const stats = await this.getBackupStats();
            console.log('📊 Estatísticas do backup:', stats);
            console.log('🧪 Teste de backup concluído com sucesso!');
        }
        catch (error) {
            console.error('❌ Falha no teste de backup:', error);
            throw error;
        }
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BackupService);
//# sourceMappingURL=backup.service.js.map