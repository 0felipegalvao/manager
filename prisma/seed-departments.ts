import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function seedDepartments() {
  console.log('🏢 Criando departamentos padrão...');

  const departments = [
    {
      name: 'Folha/Fiscal',
      description: 'Departamento de Folha de Pagamento e Fiscal',
      isActive: true
    },
    {
      name: 'Contábil',
      description: 'Departamento Contábil',
      isActive: true
    },
    {
      name: 'Societário',
      description: 'Departamento Societário',
      isActive: true
    },
    {
      name: 'Trabalhista',
      description: 'Departamento Trabalhista',
      isActive: true
    }
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept
    });
    console.log(`✅ Departamento "${dept.name}" criado/atualizado`);
  }

  console.log('🎉 Departamentos criados com sucesso!');
}

seedDepartments()
  .catch((e) => {
    console.error('❌ Erro ao criar departamentos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
