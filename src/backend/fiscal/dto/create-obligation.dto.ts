import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDateString, IsBoolean, Min, Max } from 'class-validator';
import { ObligationType, ObligationStatus } from '../../../generated/prisma';

export class CreateObligationDto {
  @ApiProperty({
    description: 'Nome da obrigação fiscal',
    example: 'DAS - Simples Nacional',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Descrição da obrigação',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Tipo da obrigação',
    enum: ObligationType,
    example: ObligationType.MENSAL,
  })
  @IsEnum(ObligationType, { message: 'Tipo de obrigação inválido' })
  type: ObligationType;

  @ApiProperty({
    description: 'Status da obrigação',
    enum: ObligationStatus,
    example: ObligationStatus.PENDENTE,
    required: false,
  })
  @IsOptional()
  @IsEnum(ObligationStatus, { message: 'Status inválido' })
  status?: ObligationStatus = ObligationStatus.PENDENTE;

  @ApiProperty({
    description: 'Data de vencimento',
    example: '2024-01-31T23:59:59.000Z',
  })
  @IsDateString({}, { message: 'Data de vencimento deve ser uma data válida' })
  dueDate: string;

  @ApiProperty({
    description: 'Data de conclusão',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de conclusão deve ser uma data válida' })
  completedAt?: string;

  @ApiProperty({
    description: 'Prioridade (1=baixa, 2=média, 3=alta)',
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
    description: 'Se a obrigação é recorrente',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Recorrente deve ser um valor booleano' })
  recurrent?: boolean = false;

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @Min(1, { message: 'ID do cliente deve ser maior que 0' })
  clientId: number;
}
