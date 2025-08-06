import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString, Min, Max } from 'class-validator';

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
    example: 'PENDENTE',
    enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  status?: string = 'PENDENTE';

  @ApiProperty({
    description: 'Prioridade da tarefa (1=baixa, 2=média, 3=alta)',
    example: 2,
    minimum: 1,
    maximum: 3,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Prioridade deve ser um número inteiro' })
  @Min(1, { message: 'Prioridade deve ser no mínimo 1' })
  @Max(3, { message: 'Prioridade deve ser no máximo 3' })
  priority?: number = 1;

  @ApiProperty({
    description: 'Data de vencimento da tarefa',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  dueDate?: string;

  @ApiProperty({
    description: 'ID da obrigação relacionada à tarefa',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'ID da obrigação deve ser um número inteiro' })
  @Min(1, { message: 'ID da obrigação deve ser maior que 0' })
  obligationId?: number;

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
