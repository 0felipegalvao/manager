import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsDateString, IsString, IsInt } from 'class-validator';
import { TaxRegime } from '../../../generated/prisma';

export class CreateTaxRegimeHistoryDto {
  @ApiProperty({
    description: 'Regime tributário',
    enum: TaxRegime,
  })
  @IsEnum(TaxRegime, { message: 'Regime tributário inválido' })
  taxRegime: TaxRegime;

  @ApiProperty({
    description: 'Data de início do regime',
  })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  startDate: string;

  @ApiProperty({
    description: 'Data de fim do regime',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  endDate?: string;

  @ApiProperty({
    description: 'Motivo da mudança',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Motivo deve ser uma string' })
  reason?: string;

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
