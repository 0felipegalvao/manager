import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsInt } from 'class-validator';

export class CreateClientContactDto {
  @ApiProperty({
    description: 'Nome do contato',
    example: 'Maria Santos',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Email do contato',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Telefone do contato',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  phone?: string;

  @ApiProperty({
    description: 'Celular do contato',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Celular deve ser uma string' })
  cellphone?: string;

  @ApiProperty({
    description: 'Cargo/posição do contato',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Posição deve ser uma string' })
  position?: string;

  @ApiProperty({
    description: 'Departamento do contato',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Departamento deve ser uma string' })
  department?: string;

  @ApiProperty({
    description: 'Se o contato está ativo',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'IsActive deve ser um valor booleano' })
  isActive?: boolean;

  @ApiProperty({
    description: 'ID do cliente',
  })
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  clientId: number;
}
