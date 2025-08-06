import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsArray, Min } from 'class-validator';
import { DocumentType, DocumentStatus } from '../../../generated/prisma';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Nome do documento',
    example: 'Nota Fiscal Janeiro 2024',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Nome do arquivo',
    example: 'nf_janeiro_2024.pdf',
  })
  @IsString({ message: 'Nome do arquivo deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do arquivo é obrigatório' })
  fileName: string;

  @ApiProperty({
    description: 'Caminho do arquivo no servidor',
    example: '/uploads/documents/nf_janeiro_2024.pdf',
  })
  @IsString({ message: 'Caminho do arquivo deve ser uma string' })
  @IsNotEmpty({ message: 'Caminho do arquivo é obrigatório' })
  filePath: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1024000,
  })
  @IsInt({ message: 'Tamanho do arquivo deve ser um número inteiro' })
  @Min(1, { message: 'Tamanho do arquivo deve ser maior que 0' })
  fileSize: number;

  @ApiProperty({
    description: 'Tipo MIME do arquivo',
    example: 'application/pdf',
  })
  @IsString({ message: 'Tipo MIME deve ser uma string' })
  @IsNotEmpty({ message: 'Tipo MIME é obrigatório' })
  mimeType: string;

  @ApiProperty({
    description: 'Tipo do documento',
    enum: DocumentType,
    example: DocumentType.NOTA_FISCAL,
  })
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
  type: DocumentType;

  @ApiProperty({
    description: 'Status do documento',
    enum: DocumentStatus,
    example: DocumentStatus.PENDENTE,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentStatus, { message: 'Status inválido' })
  status?: DocumentStatus = DocumentStatus.PENDENTE;

  @ApiProperty({
    description: 'Descrição do documento',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Versão do documento',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Versão deve ser um número inteiro' })
  @Min(1, { message: 'Versão deve ser maior que 0' })
  version?: number = 1;

  @ApiProperty({
    description: 'Tags do documento',
    example: ['fiscal', 'janeiro', '2024'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[] = [];

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  @IsInt({ message: 'ID do cliente deve ser um número inteiro' })
  @Min(1, { message: 'ID do cliente deve ser maior que 0' })
  clientId: number;
}
