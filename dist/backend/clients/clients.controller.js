"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const clients_service_1 = require("./clients.service");
const clients_import_service_1 = require("./clients-import.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const import_client_dto_1 = require("./dto/import-client.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ClientsController = class ClientsController {
    constructor(clientsService, clientsImportService) {
        this.clientsService = clientsService;
        this.clientsImportService = clientsImportService;
    }
    create(createClientDto, req) {
        return this.clientsService.create(createClientDto, req.user.id);
    }
    findAll(req, all) {
        const userId = req.user.role === 'ADMIN' && all === 'true' ? undefined : req.user.id;
        return this.clientsService.findAll(userId);
    }
    getStats(req) {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        return this.clientsService.getStats(userId);
    }
    findOne(id) {
        return this.clientsService.findOne(+id);
    }
    findByCnpj(cnpj) {
        return this.clientsService.findByCnpj(cnpj);
    }
    update(id, updateClientDto) {
        return this.clientsService.update(+id, updateClientDto);
    }
    remove(id) {
        return this.clientsService.remove(+id);
    }
    async importClients(file, req) {
        if (!file) {
            throw new Error('Arquivo não fornecido');
        }
        return this.clientsImportService.importFromFile(file.buffer, req.user.id);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo cliente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cliente criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'CNPJ já está cadastrado' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto, Object]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os clientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de clientes' }),
    (0, swagger_1.ApiQuery)({ name: 'all', required: false, description: 'Se true, lista todos os clientes (apenas admin)' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas dos clientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas dos clientes' }),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cliente por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cliente por CNPJ' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente encontrado' }),
    (0, common_1.Get)('cnpj/:cnpj'),
    __param(0, (0, common_1.Param)('cnpj')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findByCnpj", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente atualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente removido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente não encontrado' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Importar clientes em massa de planilha Excel/CSV' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Importação realizada com sucesso', type: import_client_dto_1.ImportResultDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Arquivo inválido ou erro no processamento' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "importClients", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)('clients'),
    (0, common_1.Controller)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [clients_service_1.ClientsService,
        clients_import_service_1.ClientsImportService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map