import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Título da notificação',
    example: 'Obrigação Fiscal Próxima ao Vencimento',
  })
  @IsString({ message: 'Título deve ser uma string' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @ApiProperty({
    description: 'Mensagem da notificação',
    example: 'A obrigação DAS vence em 3 dias',
  })
  @IsString({ message: 'Mensagem deve ser uma string' })
  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  message: string;

  @ApiProperty({
    description: 'Tipo da notificação',
    example: 'WARNING',
    enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tipo deve ser uma string' })
  type?: string = 'INFO';

  @ApiProperty({
    description: 'Se a notificação foi lida',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Read deve ser um valor booleano' })
  read?: boolean = false;

  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  @IsInt({ message: 'ID do usuário deve ser um número inteiro' })
  @Min(1, { message: 'ID do usuário deve ser maior que 0' })
  userId: number;
}
