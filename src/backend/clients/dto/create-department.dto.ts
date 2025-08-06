import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Nome do departamento',
    example: 'Folha/Fiscal',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Descrição do departamento',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Se o departamento está ativo',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'IsActive deve ser um valor booleano' })
  isActive?: boolean;
}
