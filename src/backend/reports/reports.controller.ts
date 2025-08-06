import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../../generated/prisma';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  @ApiResponse({ status: 200, description: 'Estatísticas do dashboard' })
  @Get('dashboard')
  getDashboardStats(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getDashboardStats(userId);
  }

  @ApiOperation({ summary: 'Obter clientes por status' })
  @ApiResponse({ status: 200, description: 'Distribuição de clientes por status' })
  @Get('clients/by-status')
  getClientsByStatus(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getClientsByStatus(userId);
  }

  @ApiOperation({ summary: 'Obter clientes por regime tributário' })
  @ApiResponse({ status: 200, description: 'Distribuição de clientes por regime tributário' })
  @Get('clients/by-tax-regime')
  getClientsByTaxRegime(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getClientsByTaxRegime(userId);
  }

  @ApiOperation({ summary: 'Obter documentos por tipo' })
  @ApiResponse({ status: 200, description: 'Distribuição de documentos por tipo' })
  @Get('documents/by-type')
  getDocumentsByType(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getDocumentsByType(userId);
  }

  @ApiOperation({ summary: 'Obter documentos por status' })
  @ApiResponse({ status: 200, description: 'Distribuição de documentos por status' })
  @Get('documents/by-status')
  getDocumentsByStatus(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getDocumentsByStatus(userId);
  }

  @ApiOperation({ summary: 'Obter obrigações por status' })
  @ApiResponse({ status: 200, description: 'Distribuição de obrigações por status' })
  @Get('obligations/by-status')
  getObligationsByStatus(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getObligationsByStatus(userId);
  }

  @ApiOperation({ summary: 'Obter obrigações por tipo' })
  @ApiResponse({ status: 200, description: 'Distribuição de obrigações por tipo' })
  @Get('obligations/by-type')
  getObligationsByType(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getObligationsByType(userId);
  }

  @ApiOperation({ summary: 'Obter estatísticas mensais' })
  @ApiResponse({ status: 200, description: 'Estatísticas mensais do ano' })
  @ApiQuery({ name: 'year', required: true, description: 'Ano para o relatório' })
  @Get('monthly')
  getMonthlyStats(@CurrentUser() user: any, @Query('year') year: string) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getMonthlyStats(+year, userId);
  }

  @ApiOperation({ summary: 'Obter top clientes' })
  @ApiResponse({ status: 200, description: 'Clientes com mais atividade' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de clientes (padrão: 10)' })
  @Get('clients/top')
  getTopClients(@CurrentUser() user: any, @Query('limit') limit?: string) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getTopClients(limit ? +limit : 10, userId);
  }

  @ApiOperation({ summary: 'Obter relatório de receita' })
  @ApiResponse({ status: 200, description: 'Relatório de receita mensal' })
  @ApiQuery({ name: 'year', required: true, description: 'Ano para o relatório' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Get('revenue')
  getRevenueReport(@CurrentUser() user: any, @Query('year') year: string) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.reportsService.getRevenueReport(+year, userId);
  }
}
