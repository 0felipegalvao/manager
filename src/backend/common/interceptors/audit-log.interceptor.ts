import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;
    
    // Capturar informações da requisição
    const action = this.getActionFromMethod(method);
    const entity = this.getEntityFromUrl(url);
    const ipAddress = request.ip || request.connection.remoteAddress;
    const userAgent = request.get('User-Agent');

    return next.handle().pipe(
      tap(async (response) => {
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
          } catch (error) {
            // Log do erro, mas não interrompe a execução
            console.error('Erro ao criar log de auditoria:', error);
          }
        }
      }),
    );
  }

  private getActionFromMethod(method: string): string {
    const actionMap: Record<string, string> = {
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
      GET: 'READ',
    };
    return actionMap[method] || 'UNKNOWN';
  }

  private getEntityFromUrl(url: string): string {
    // Extrair entidade da URL (ex: /api/clients -> clients)
    const segments = url.split('/').filter(Boolean);
    if (segments.length >= 2) {
      return segments[1].toUpperCase();
    }
    return 'UNKNOWN';
  }

  private extractEntityId(response: any): number | null {
    if (response && typeof response === 'object' && response.id) {
      return response.id;
    }
    return null;
  }
}
