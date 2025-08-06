"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../src/generated/prisma");
var bcrypt = require("bcrypt");
var prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, contadorPassword, assistentePassword, admin, contador, assistente, cliente1, cliente2, cliente3, hoje, proximoMes, mesPassado;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Iniciando seed do banco de dados...');
                    // Limpar dados existentes
                    return [4 /*yield*/, prisma.notification.deleteMany()];
                case 1:
                    // Limpar dados existentes
                    _a.sent();
                    return [4 /*yield*/, prisma.document.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.obligation.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.client.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, bcrypt.hash('admin123', 10)];
                case 6:
                    adminPassword = _a.sent();
                    return [4 /*yield*/, bcrypt.hash('contador123', 10)];
                case 7:
                    contadorPassword = _a.sent();
                    return [4 /*yield*/, bcrypt.hash('assistente123', 10)];
                case 8:
                    assistentePassword = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Administrador',
                                email: 'admin@gestao.com',
                                password: adminPassword,
                                role: 'ADMIN',
                            },
                        })];
                case 9:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'João Contador',
                                email: 'contador@gestao.com',
                                password: contadorPassword,
                                role: 'CONTADOR',
                            },
                        })];
                case 10:
                    contador = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Maria Assistente',
                                email: 'assistente@gestao.com',
                                password: assistentePassword,
                                role: 'ASSISTENTE',
                            },
                        })];
                case 11:
                    assistente = _a.sent();
                    console.log('✅ Usuários criados');
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                razaoSocial: 'Empresa ABC Ltda',
                                nomeFantasia: 'ABC Comércio',
                                cnpj: '12345678000190',
                                inscricaoEstadual: '123456789',
                                email: 'contato@abc.com',
                                telefone: '11123456789',
                                endereco: 'Rua das Flores',
                                numero: '123',
                                bairro: 'Centro',
                                cidade: 'São Paulo',
                                estado: 'SP',
                                cep: '01234567',
                                taxRegime: 'SIMPLES_NACIONAL',
                                status: 'ATIVO',
                                valorMensal: 500.00,
                                dataVencimento: new Date(2024, 0, 10),
                                userId: contador.id,
                            },
                        })];
                case 12:
                    cliente1 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                razaoSocial: 'Tech Solutions SA',
                                nomeFantasia: 'TechSol',
                                cnpj: '98765432000110',
                                inscricaoEstadual: '987654321',
                                email: 'contato@techsol.com',
                                telefone: '11987654321',
                                endereco: 'Av. Paulista',
                                numero: '1000',
                                bairro: 'Bela Vista',
                                cidade: 'São Paulo',
                                estado: 'SP',
                                cep: '01310100',
                                taxRegime: 'LUCRO_PRESUMIDO',
                                status: 'ATIVO',
                                valorMensal: 1200.00,
                                dataVencimento: new Date(2024, 0, 15),
                                userId: contador.id,
                            },
                        })];
                case 13:
                    cliente2 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                razaoSocial: 'Comércio XYZ ME',
                                nomeFantasia: 'XYZ Loja',
                                cnpj: '11222333000144',
                                inscricaoEstadual: '111222333',
                                email: 'contato@xyz.com',
                                telefone: '11111122222',
                                endereco: 'Rua do Comércio',
                                numero: '456',
                                bairro: 'Vila Madalena',
                                cidade: 'São Paulo',
                                estado: 'SP',
                                cep: '02345678',
                                taxRegime: 'MEI',
                                status: 'ATIVO',
                                valorMensal: 150.00,
                                dataVencimento: new Date(2024, 0, 20),
                                userId: assistente.id,
                            },
                        })];
                case 14:
                    cliente3 = _a.sent();
                    console.log('✅ Clientes criados');
                    // Criar documentos de exemplo
                    return [4 /*yield*/, prisma.document.create({
                            data: {
                                name: 'Balancete Janeiro 2024',
                                fileName: 'balancete-jan-2024.pdf',
                                filePath: '/uploads/balancete-jan-2024.pdf',
                                fileSize: 1024000,
                                description: 'Balancete mensal de janeiro',
                                type: 'BALANCETE',
                                status: 'APROVADO',
                                mimeType: 'application/pdf',
                                clientId: cliente1.id,
                                userId: contador.id,
                            },
                        })];
                case 15:
                    // Criar documentos de exemplo
                    _a.sent();
                    return [4 /*yield*/, prisma.document.create({
                            data: {
                                name: 'DRE Dezembro 2023',
                                fileName: 'dre-dez-2023.pdf',
                                filePath: '/uploads/dre-dez-2023.pdf',
                                fileSize: 856000,
                                description: 'Demonstração do Resultado do Exercício',
                                type: 'DRE',
                                status: 'PENDENTE',
                                mimeType: 'application/pdf',
                                clientId: cliente2.id,
                                userId: contador.id,
                            },
                        })];
                case 16:
                    _a.sent();
                    console.log('✅ Documentos criados');
                    hoje = new Date();
                    proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 10);
                    mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15);
                    return [4 /*yield*/, prisma.obligation.create({
                            data: {
                                name: 'DAS - Simples Nacional',
                                description: 'Documento de Arrecadação do Simples Nacional',
                                type: 'MENSAL',
                                dueDate: proximoMes,
                                status: 'PENDENTE',
                                clientId: cliente1.id,
                            },
                        })];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, prisma.obligation.create({
                            data: {
                                name: 'DARF - IRPJ',
                                description: 'Imposto de Renda Pessoa Jurídica',
                                type: 'TRIMESTRAL',
                                dueDate: mesPassado,
                                status: 'EM_ANDAMENTO',
                                clientId: cliente2.id,
                            },
                        })];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, prisma.obligation.create({
                            data: {
                                name: 'PGDAS-D',
                                description: 'Programa Gerador do DAS Declaratório',
                                type: 'ANUAL',
                                dueDate: new Date(hoje.getFullYear(), hoje.getMonth(), 20),
                                status: 'CONCLUIDA',
                                clientId: cliente3.id,
                            },
                        })];
                case 19:
                    _a.sent();
                    console.log('✅ Obrigações fiscais criadas');
                    // Criar notificações de exemplo
                    return [4 /*yield*/, prisma.notification.create({
                            data: {
                                title: 'Bem-vindo ao Sistema!',
                                message: 'Seja bem-vindo ao Sistema de Gestão Contábil. Explore todas as funcionalidades disponíveis.',
                                type: 'INFO',
                                read: false,
                                userId: contador.id,
                            },
                        })];
                case 20:
                    // Criar notificações de exemplo
                    _a.sent();
                    return [4 /*yield*/, prisma.notification.create({
                            data: {
                                title: 'Obrigação Próxima ao Vencimento',
                                message: 'A obrigação DAS da Empresa ABC Ltda vence em breve.',
                                type: 'WARNING',
                                read: false,
                                userId: contador.id,
                            },
                        })];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, prisma.notification.create({
                            data: {
                                title: 'Documento Aprovado',
                                message: 'O balancete de janeiro foi aprovado com sucesso.',
                                type: 'SUCCESS',
                                read: true,
                                userId: contador.id,
                            },
                        })];
                case 22:
                    _a.sent();
                    console.log('✅ Notificações criadas');
                    console.log('🎉 Seed concluído com sucesso!');
                    console.log('\n📋 Credenciais de acesso:');
                    console.log('👤 Admin: admin@gestao.com / admin123');
                    console.log('👤 Contador: contador@gestao.com / contador123');
                    console.log('👤 Assistente: assistente@gestao.com / assistente123');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
