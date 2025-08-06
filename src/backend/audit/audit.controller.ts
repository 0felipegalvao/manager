import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../../generated/prisma';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Listar logs de auditoria' })
  @ApiResponse({ status: 200, description: 'Lista de logs de auditoria' })
  @ApiQuery({ name: 'entity', required: false, description: 'Filtrar por entidade' })
  @ApiQuery({ name: 'action', required: false, description: 'Filtrar por ação' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por usuário' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial (ISO)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final (ISO)' })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 50)' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      entity,
      action,
      userId: userId ? +userId : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const pagination = {
      page: page ? +page : 1,
      limit: limit ? +limit : 50,
    };

    return this.auditService.findAll(filters, pagination);
  }

  @ApiOperation({ summary: 'Obter estatísticas de auditoria' })
  @ApiResponse({ status: 200, description: 'Estatísticas de auditoria' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial (ISO)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final (ISO)' })
  @Roles(UserRole.ADMIN)
  @Get('stats')
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.auditService.getStats(filters);
  }

  @ApiOperation({ summary: 'Obter logs por entidade' })
  @ApiResponse({ status: 200, description: 'Logs da entidade' })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 20)' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Get('entity/:entity/:entityId')
  findByEntity(
    @Param('entity') entity: string,
    @Param('entityId') entityId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = {
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    };

    return this.auditService.findByEntity(entity, +entityId, pagination);
  }

  @ApiOperation({ summary: 'Obter logs por usuário' })
  @ApiResponse({ status: 200, description: 'Logs do usuário' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial (ISO)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final (ISO)' })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (padrão: 20)' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const pagination = {
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    };

    return this.auditService.findByUser(+userId, filters, pagination);
  }

  @ApiOperation({ summary: 'Obter log específico por ID' })
  @ApiResponse({ status: 200, description: 'Log de auditoria' })
  @ApiResponse({ status: 404, description: 'Log não encontrado' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }
}
