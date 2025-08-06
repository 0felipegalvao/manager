# Guia de Migração - Reestruturação do Sistema de Clientes

## Visão Geral

Este documento descreve o processo completo de reestruturação do sistema de clientes, movendo campos de `customFields` para colunas diretas no banco de dados e criando novas tabelas relacionais.

## Objetivos da Migração

1. **Melhor Performance**: Campos diretos permitem consultas SQL mais eficientes
2. **Validação de Dados**: Tipos específicos e constraints no banco de dados
3. **Relacionamentos**: Estrutura relacional adequada para Partners, Contacts, etc.
4. **Manutenibilidade**: Código mais limpo e estruturado

## Estrutura Anterior vs Nova

### Antes
```json
{
  "customFields": {
    "cpf": "12345678901",
    "codigoSimples": "123456",
    "porte": "ME",
    "departamento": "Folha/Fiscal",
    "porcPJEcac": "SIM",
    "procPFEcac": "NAO"
  }
}
```

### Depois
```sql
-- Campos diretos na tabela clients
cpf VARCHAR,
codigoSimples VARCHAR,
porte CompanySize,
departmentId INTEGER REFERENCES departments(id),
porcPJEcac EcacPJ,
procPFEcac EcacPF

-- Tabelas relacionais
partners (id, clientId, name, cpf, participacao, qualificacao)
client_contacts (id, clientId, name, email, phone, position)
tax_regime_history (id, clientId, taxRegime, startDate, endDate)
departments (id, name, description, isActive)
registration_status (id, clientId, federalStatus, stateStatus, municipalStatus)
```

## Processo de Migração

### 1. Backup dos Dados
```bash
pg_dump "postgresql://postgres:postgres@localhost:5432/gestao_contabil" > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Atualização do Schema Prisma

#### Novos Enums
```prisma
enum CompanySize {
  ME
  EPP
  GRANDE
}

enum EcacPJ {
  SIM
  NAO
}

enum EcacPF {
  SIM
  NAO
}
```

#### Novos Campos no Cliente
```prisma
model Client {
  // ... campos existentes
  
  // Campos específicos do sistema contábil
  cpf                  String?
  codigoSimples        String?
  inicioAtividade      DateTime?
  inicioEscritorio     DateTime?
  dataSituacao         DateTime?
  porte                CompanySize?
  departmentId         Int?
  porcPJEcac           EcacPJ?
  procPFEcac           EcacPF?
  
  // Relacionamentos
  department           Department? @relation(fields: [departmentId], references: [id])
  partners             Partner[]
  clientContacts       ClientContact[]
  taxRegimeHistory     TaxRegimeHistory[]
  registrationStatus   RegistrationStatus?
}
```

### 3. Novas Tabelas Relacionais

#### Partners (Sócios)
```prisma
model Partner {
  id           Int      @id @default(autoincrement())
  name         String
  cpf          String?
  participacao Decimal? @db.Decimal(5,2)
  qualificacao String?
  clientId     Int
  client       Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
}
```

#### Client Contacts (Contatos Adicionais)
```prisma
model ClientContact {
  id          Int      @id @default(autoincrement())
  name        String
  email       String?
  phone       String?
  cellphone   String?
  position    String?
  department  String?
  isActive    Boolean  @default(true)
  clientId    Int
  client      Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
}
```

### 4. Execução das Migrações

```bash
# Gerar migração
npx prisma migrate dev --name add_client_direct_fields

# Aplicar migrações
npx prisma migrate deploy

# Popular departamentos padrão
npx tsx prisma/seed-departments.ts
```

### 5. Atualização do Backend

#### DTOs Atualizados
- `CreateClientDto`: Incluídos novos campos diretos
- `UpdateClientDto`: Herda automaticamente via PartialType
- Novos DTOs para entidades relacionais

#### Services Atualizados
- `ClientsService`: Include dos novos relacionamentos
- Queries otimizadas com joins

### 6. Atualização do Frontend

#### Formulário de Cliente
- Campos movidos de "Campos Extras" para abas principais
- Novas abas: "Sócios", "Contatos"
- Select de departamento com IDs

#### Página de Detalhes
- Exibição dos novos campos diretos
- Seções para relacionamentos

## Comandos Úteis

### Reset Completo do Banco
```bash
docker-compose down -v
docker-compose up -d
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/seed-departments.ts
```

### Verificação da Estrutura
```sql
-- Verificar colunas da tabela clients
\d clients

-- Verificar departamentos
SELECT * FROM departments;

-- Verificar todas as tabelas
\dt
```

### Build e Teste
```bash
npm run build
npm run dev
```

## Benefícios Alcançados

1. **Performance**: Consultas SQL diretas ao invés de JSON parsing
2. **Validação**: Constraints e tipos no banco de dados
3. **Relacionamentos**: Estrutura normalizada
4. **Manutenibilidade**: Código mais limpo e tipado
5. **Escalabilidade**: Estrutura preparada para crescimento

## Considerações Futuras

1. **Índices**: Adicionar índices nos campos mais consultados
2. **Auditoria**: Implementar logs de mudanças nos relacionamentos
3. **API**: Endpoints específicos para gerenciar relacionamentos
4. **Validações**: Regras de negócio mais robustas

## Troubleshooting

### Erro de Migração
```bash
# Reset das migrações
npx prisma migrate reset
npx prisma migrate deploy
```

### Problemas de Relacionamento
```sql
-- Verificar foreign keys
SELECT * FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY';
```

### Dados Inconsistentes
```sql
-- Verificar integridade
SELECT c.id, c.razaoSocial, d.name as department_name 
FROM clients c 
LEFT JOIN departments d ON c.departmentId = d.id;
```
