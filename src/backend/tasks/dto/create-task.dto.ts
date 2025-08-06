import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsDateString, Min } from 'class-validator';

export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

export enum TaskPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Processar documentos do cliente XYZ',
  })
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Processar e organizar todos os documentos fiscais do cliente XYZ para o mês de janeiro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDENTE,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status deve ser um valor válido' })
  status?: TaskStatus = TaskStatus.PENDENTE;

  @ApiProperty({
    description: 'Prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.MEDIA,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Prioridade deve ser um valor válido' })
  priority?: TaskPriority = TaskPriority.MEDIA;

  @ApiProperty({
    description: 'Data de vencimento da tarefa',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  dueDate?: string;

  @ApiProperty({
    description: 'ID do usuário responsável pela tarefa',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'ID do responsável deve ser um número inteiro' })
  @Min(1, { message: 'ID do responsável deve ser maior que 0' })
  assignedToId?: number;

  @ApiProperty({
    description: 'ID do cliente relacionado à tarefa',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @Min(1, { message: 'ID do cliente deve ser maior que 0' })
  clientId?: number;
}
