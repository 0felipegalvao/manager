import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../../generated/prisma';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Criar nova notificação' })
  @ApiResponse({ status: 201, description: 'Notificação criada com sucesso' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @ApiOperation({ summary: 'Listar todas as notificações' })
  @ApiResponse({ status: 200, description: 'Lista de notificações' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por usuário' })
  @Get()
  findAll(@CurrentUser() user: any, @Query('userId') userId?: string) {
    // Se não for admin, só pode ver suas próprias notificações
    const targetUserId = user.role === UserRole.ADMIN && userId ? +userId : user.id;
    return this.notificationsService.findAll(targetUserId);
  }

  @ApiOperation({ summary: 'Listar notificações não lidas' })
  @ApiResponse({ status: 200, description: 'Notificações não lidas' })
  @Get('unread')
  findUnread(@CurrentUser() user: any) {
    return this.notificationsService.findUnread(user.id);
  }

  @ApiOperation({ summary: 'Obter estatísticas das notificações' })
  @ApiResponse({ status: 200, description: 'Estatísticas das notificações' })
  @Get('stats')
  getStats(@CurrentUser() user: any) {
    const userId = user.role === UserRole.ADMIN ? undefined : user.id;
    return this.notificationsService.getStats(userId);
  }

  @ApiOperation({ summary: 'Marcar todas como lidas' })
  @ApiResponse({ status: 200, description: 'Notificações marcadas como lidas' })
  @Post('mark-all-read')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @ApiOperation({ summary: 'Buscar notificação por ID' })
  @ApiResponse({ status: 200, description: 'Notificação encontrada' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiResponse({ status: 200, description: 'Notificação marcada como lida' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @ApiOperation({ summary: 'Atualizar notificação' })
  @ApiResponse({ status: 200, description: 'Notificação atualizada' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @ApiOperation({ summary: 'Remover notificação' })
  @ApiResponse({ status: 200, description: 'Notificação removida' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  @Roles(UserRole.ADMIN, UserRole.CONTADOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
