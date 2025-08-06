import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDecimal, IsInt } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({
    description: 'Nome do sócio',
    example: 'João Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'CPF do sócio',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  cpf?: string;

  @ApiProperty({
    description: 'Percentual de participação',
    required: false,
    example: 50.00,
  })
  @IsOptional()
  @IsDecimal({}, { message: 'Participação deve ser um valor decimal' })
  participacao?: string;

  @ApiProperty({
    description: 'Qualificação do sócio',
    required: false,
    example: 'Administrador',
  })
  @IsOptional()
  @IsString({ message: 'Qualificação deve ser uma string' })
  qualificacao?: string;

  @ApiProperty({
    description: 'ID do cliente',
  })
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  clientId: number;
}
