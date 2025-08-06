import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'Criar novo documento' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
    return this.documentsService.create(createDocumentDto, req.user.id);
  }

  @ApiOperation({ summary: 'Listar todos os documentos' })
  @ApiResponse({ status: 200, description: 'Lista de documentos' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get()
  findAll(@Request() req, @Query('clientId') clientId?: string) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
    return this.documentsService.findAll(clientId ? +clientId : undefined, userId);
  }

  @ApiOperation({ summary: 'Obter estatísticas dos documentos' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos documentos' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('stats')
  getStats(@Request() req, @Query('clientId') clientId?: string) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
    return this.documentsService.getStats(clientId ? +clientId : undefined, userId);
  }

  @ApiOperation({ summary: 'Buscar documentos por tipo' })
  @ApiResponse({ status: 200, description: 'Documentos encontrados' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filtrar por cliente' })
  @Get('type/:type')
  findByType(@Param('type') type: string, @Query('clientId') clientId?: string) {
    return this.documentsService.findByType(type, clientId ? +clientId : undefined);
  }

  @ApiOperation({ summary: 'Buscar documento por ID' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualizar documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @ApiOperation({ summary: 'Remover documento' })
  @ApiResponse({ status: 200, description: 'Documento removido' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
