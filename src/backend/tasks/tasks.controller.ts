import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../../generated/prisma';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Criar nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filtrar por prioridade' })
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('clientId') clientId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.tasksService.findAll(
      userId,
      clientId ? +clientId : undefined,
      status,
      priority ? +priority : undefined,
    );
  }

  @ApiOperation({ summary: 'Obter estatísticas das tarefas' })
  @ApiResponse({ status: 200, description: 'Estatísticas das tarefas' })
  @Get('stats')
  getStats(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.tasksService.getStats(userId);
  }

  @ApiOperation({ summary: 'Listar tarefas por status' })
  @ApiResponse({ status: 200, description: 'Tarefas filtradas por status' })
  @Get('by-status/:status')
  findByStatus(@Param('status') status: string, @CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.tasksService.findByStatus(status, userId);
  }

  @ApiOperation({ summary: 'Listar tarefas próximas ao vencimento' })
  @ApiResponse({ status: 200, description: 'Tarefas próximas ao vencimento' })
  @ApiQuery({ name: 'days', required: false, description: 'Número de dias (padrão: 7)' })
  @Get('upcoming')
  findUpcoming(@CurrentUser() user: any, @Query('days') days?: string) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.tasksService.findUpcoming(days ? +days : 7, userId);
  }

  @ApiOperation({ summary: 'Listar tarefas atrasadas' })
  @ApiResponse({ status: 200, description: 'Tarefas atrasadas' })
  @Get('overdue')
  findOverdue(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.tasksService.findOverdue(userId);
  }

  @ApiOperation({ summary: 'Obter tarefa por ID' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Marcar tarefa como concluída' })
  @ApiResponse({ status: 200, description: 'Tarefa marcada como concluída' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.tasksService.complete(+id);
  }

  @ApiOperation({ summary: 'Remover tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
