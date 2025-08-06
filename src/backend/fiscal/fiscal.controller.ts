import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FiscalService } from './fiscal.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { UpdateObligationDto } from './dto/update-obligation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('fiscal')
@Controller('fiscal')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @ApiOperation({ summary: 'Criar nova obrigação fiscal' })
  @ApiResponse({ status: 201, description: 'Obrigação criada com sucesso' })
  @Post('obligations')
  createObligation(@Body() createObligationDto: CreateObligationDto) {
    return this.fiscalService.createObligation(createObligationDto);
  }

  @ApiOperation({ summary: 'Listar todas as obrigações fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de obrigações fiscais' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('obligations')
  findAllObligations(@Query('clientId') clientId?: string) {
    return this.fiscalService.findAllObligations(clientId ? +clientId : undefined);
  }

  @ApiOperation({ summary: 'Obter estatísticas das obrigações fiscais' })
  @ApiResponse({ status: 200, description: 'Estatísticas das obrigações' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('obligations/stats')
  getObligationStats(@Query('clientId') clientId?: string) {
    return this.fiscalService.getObligationStats(clientId ? +clientId : undefined);
  }

  @ApiOperation({ summary: 'Obter obrigações próximas ao vencimento' })
  @ApiResponse({ status: 200, description: 'Obrigações próximas' })
  @ApiQuery({ name: 'days', required: false, description: 'Número de dias (padrão: 30)' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('obligations/upcoming')
  getUpcomingObligations(
    @Query('days') days?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.fiscalService.getUpcomingObligations(
      days ? +days : 30,
      clientId ? +clientId : undefined,
    );
  }

  @ApiOperation({ summary: 'Obter obrigações em atraso' })
  @ApiResponse({ status: 200, description: 'Obrigações em atraso' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('obligations/overdue')
  getOverdueObligations(@Query('clientId') clientId?: string) {
    return this.fiscalService.getOverdueObligations(clientId ? +clientId : undefined);
  }

  @ApiOperation({ summary: 'Obter dados do calendário fiscal' })
  @ApiResponse({ status: 200, description: 'Dados do calendário' })
  @ApiQuery({ name: 'year', required: true, description: 'Ano' })
  @ApiQuery({ name: 'month', required: true, description: 'Mês (1-12)' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('calendar')
  getCalendarData(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.fiscalService.getCalendarData(
      +year,
      +month,
      clientId ? +clientId : undefined,
    );
  }

  @ApiOperation({ summary: 'Buscar obrigação por ID' })
  @ApiResponse({ status: 200, description: 'Obrigação encontrada' })
  @ApiResponse({ status: 404, description: 'Obrigação não encontrada' })
  @Get('obligations/:id')
  findObligationById(@Param('id') id: string) {
    return this.fiscalService.findObligationById(+id);
  }

  @ApiOperation({ summary: 'Atualizar obrigação fiscal' })
  @ApiResponse({ status: 200, description: 'Obrigação atualizada' })
  @ApiResponse({ status: 404, description: 'Obrigação não encontrada' })
  @Patch('obligations/:id')
  updateObligation(@Param('id') id: string, @Body() updateObligationDto: UpdateObligationDto) {
    return this.fiscalService.updateObligation(+id, updateObligationDto);
  }

  @ApiOperation({ summary: 'Remover obrigação fiscal' })
  @ApiResponse({ status: 200, description: 'Obrigação removida' })
  @ApiResponse({ status: 404, description: 'Obrigação não encontrada' })
  @Delete('obligations/:id')
  removeObligation(@Param('id') id: string) {
    return this.fiscalService.removeObligation(+id);
  }
}
