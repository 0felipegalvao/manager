import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateRegistrationStatusDto {
  @ApiProperty({
    description: 'Status do registro federal',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Status federal deve ser uma string' })
  federalStatus?: string;

  @ApiProperty({
    description: 'Status do registro estadual',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Status estadual deve ser uma string' })
  stateStatus?: string;

  @ApiProperty({
    description: 'Status do registro municipal',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Status municipal deve ser uma string' })
  municipalStatus?: string;

  @ApiProperty({
    description: 'Data do registro federal',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data federal deve ser uma data válida' })
  federalDate?: string;

  @ApiProperty({
    description: 'Data do registro estadual',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data estadual deve ser uma data válida' })
  stateDate?: string;

  @ApiProperty({
    description: 'Data do registro municipal',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data municipal deve ser uma data válida' })
  municipalDate?: string;

  @ApiProperty({
    description: 'Observações',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  observations?: string;

  @ApiProperty({
    description: 'ID do cliente',
  })
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  clientId: number;
}
