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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const documents_service_1 = require("./documents.service");
const create_document_dto_1 = require("./dto/create-document.dto");
const update_document_dto_1 = require("./dto/update-document.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    create(createDocumentDto, req) {
        return this.documentsService.create(createDocumentDto, req.user.id);
    }
    findAll(req, clientId) {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        return this.documentsService.findAll(clientId ? +clientId : undefined, userId);
    }
    getStats(req, clientId) {
        const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        return this.documentsService.getStats(clientId ? +clientId : undefined, userId);
    }
    findByType(type, clientId) {
        return this.documentsService.findByType(type, clientId ? +clientId : undefined);
    }
    findOne(id) {
        return this.documentsService.findOne(+id);
    }
    update(id, updateDocumentDto) {
        return this.documentsService.update(+id, updateDocumentDto);
    }
    remove(id) {
        return this.documentsService.remove(+id);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo documento' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Documento criado com sucesso' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_dto_1.CreateDocumentDto, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os documentos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de documentos' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas dos documentos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas dos documentos' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar documentos por tipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documentos encontrados' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filtrar por cliente' }),
    (0, common_1.Get)('type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findByType", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar documento por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documento encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Documento não encontrado' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar documento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documento atualizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Documento não encontrado' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_document_dto_1.UpdateDocumentDto]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover documento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documento removido' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Documento não encontrado' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "remove", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, swagger_1.ApiTags)('documents'),
    (0, common_1.Controller)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map