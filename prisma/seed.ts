import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.obligation.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const adminPassword = await bcrypt.hash('admin123', 10);
  const contadorPassword = await bcrypt.hash('contador123', 10);
  const assistentePassword = await bcrypt.hash('assistente123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@gestao.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const contador = await prisma.user.create({
    data: {
      name: 'João Contador',
      email: 'contador@gestao.com',
      password: contadorPassword,
      role: 'CONTADOR',
    },
  });

  const assistente = await prisma.user.create({
    data: {
      name: 'Maria Assistente',
      email: 'assistente@gestao.com',
      password: assistentePassword,
      role: 'ASSISTENTE',
    },
  });

  console.log('✅ Usuários criados');

  // Criar clientes de exemplo
  const cliente1 = await prisma.client.create({
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
  });

  const cliente2 = await prisma.client.create({
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
  });

  const cliente3 = await prisma.client.create({
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
  });

  console.log('✅ Clientes criados');

  // Criar documentos de exemplo
  await prisma.document.create({
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
  });

  await prisma.document.create({
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
  });

  console.log('✅ Documentos criados');

  // Criar obrigações fiscais de exemplo
  const hoje = new Date();
  const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 10);
  const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15);

  await prisma.obligation.create({
    data: {
      name: 'DAS - Simples Nacional',
      description: 'Documento de Arrecadação do Simples Nacional',
      type: 'MENSAL',
      dueDate: proximoMes,
      status: 'PENDENTE',
      clientId: cliente1.id,
    },
  });

  await prisma.obligation.create({
    data: {
      name: 'DARF - IRPJ',
      description: 'Imposto de Renda Pessoa Jurídica',
      type: 'TRIMESTRAL',
      dueDate: mesPassado,
      status: 'EM_ANDAMENTO',
      clientId: cliente2.id,
    },
  });

  await prisma.obligation.create({
    data: {
      name: 'PGDAS-D',
      description: 'Programa Gerador do DAS Declaratório',
      type: 'ANUAL',
      dueDate: new Date(hoje.getFullYear(), hoje.getMonth(), 20),
      status: 'CONCLUIDA',
      clientId: cliente3.id,
    },
  });

  console.log('✅ Obrigações fiscais criadas');

  // Criar notificações de exemplo
  await prisma.notification.create({
    data: {
      title: 'Bem-vindo ao Sistema!',
      message: 'Seja bem-vindo ao Sistema de Gestão Contábil. Explore todas as funcionalidades disponíveis.',
      type: 'INFO',
      read: false,
      userId: contador.id,
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Obrigação Próxima ao Vencimento',
      message: 'A obrigação DAS da Empresa ABC Ltda vence em breve.',
      type: 'WARNING',
      read: false,
      userId: contador.id,
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Documento Aprovado',
      message: 'O balancete de janeiro foi aprovado com sucesso.',
      type: 'SUCCESS',
      read: true,
      userId: contador.id,
    },
  });

  console.log('✅ Notificações criadas');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('👤 Admin: admin@gestao.com / admin123');
  console.log('👤 Contador: contador@gestao.com / contador123');
  console.log('👤 Assistente: assistente@gestao.com / assistente123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
