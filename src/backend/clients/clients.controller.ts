import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientsService } from './clients.service';
import { ClientsImportService } from './clients-import.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ImportResultDto } from './dto/import-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly clientsImportService: ClientsImportService
  ) {}

  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'CNPJ já está cadastrado' })
  @Post()
  create(@Body() createClientDto: CreateClientDto, @Request() req: any) {
    return this.clientsService.create(createClientDto, req.user.id);
  }

  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @ApiQuery({ name: 'all', required: false, description: 'Se true, lista todos os clientes (apenas admin)' })
  @Get()
  findAll(@Request() req, @Query('all') all?: string) {
    const userId = req.user.role === 'ADMIN' && all === 'true' ? undefined : req.user.id;
    return this.clientsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Obter estatísticas dos clientes' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos clientes' })
  @Get('stats')
  getStats(@Request() req) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
    return this.clientsService.getStats(userId);
  }

  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Buscar cliente por CNPJ' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @Get('cnpj/:cnpj')
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.clientsService.findByCnpj(cnpj);
  }

  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @ApiOperation({ summary: 'Remover cliente' })
  @ApiResponse({ status: 200, description: 'Cliente removido' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  @ApiOperation({ summary: 'Importar clientes em massa de planilha Excel/CSV' })
  @ApiResponse({ status: 200, description: 'Importação realizada com sucesso', type: ImportResultDto })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou erro no processamento' })
  @ApiConsumes('multipart/form-data')
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importClients(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ): Promise<ImportResultDto> {
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    return this.clientsImportService.importFromFile(file.buffer, req.user.id);
  }
}
