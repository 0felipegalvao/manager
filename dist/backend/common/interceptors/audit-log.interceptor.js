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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma.service");
let AuditLogInterceptor = class AuditLogInterceptor {
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, user, body } = request;
        // Capturar informações da requisição
        const action = this.getActionFromMethod(method);
        const entity = this.getEntityFromUrl(url);
        const ipAddress = request.ip || request.connection.remoteAddress;
        const userAgent = request.get('User-Agent');
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            // Log apenas para operações de modificação (POST, PUT, PATCH, DELETE)
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                try {
                    await this.prisma.auditLog.create({
                        data: {
                            action,
                            entity,
                            entityId: this.extractEntityId(response),
                            oldValues: method === 'PUT' || method === 'PATCH' ? body : null,
                            newValues: response || null,
                            ipAddress,
                            userAgent,
                            userId: user?.id || null,
                        },
                    });
                }
                catch (error) {
                    // Log do erro, mas não interrompe a execução
                    console.error('Erro ao criar log de auditoria:', error);
                }
            }
        }));
    }
    getActionFromMethod(method) {
        const actionMap = {
            POST: 'CREATE',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE',
            GET: 'READ',
        };
        return actionMap[method] || 'UNKNOWN';
    }
    getEntityFromUrl(url) {
        // Extrair entidade da URL (ex: /api/clients -> clients)
        const segments = url.split('/').filter(Boolean);
        if (segments.length >= 2) {
            return segments[1].toUpperCase();
        }
        return 'UNKNOWN';
    }
    extractEntityId(response) {
        if (response && typeof response === 'object' && response.id) {
            return response.id;
        }
        return null;
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map