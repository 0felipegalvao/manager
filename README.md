# Sistema de Gestão Contábil

Sistema completo para gestão de clientes de escritório de contabilidade desenvolvido com **Next.js 15** (frontend) e **NestJS** (backend).

## 🏗️ Arquitetura

- **Frontend**: Next.js 15 + Shadcn UI + Tailwind CSS
- **Backend**: NestJS + Prisma ORM + JWT Authentication
- **Banco de Dados**: PostgreSQL (Docker)
- **Administração DB**: DBGate (Docker)

## 🚀 Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Configuração do Banco de Dados

O projeto usa PostgreSQL rodando em Docker. Para iniciar o banco:

```bash
# Subir PostgreSQL + DBGate
npm run docker:up

# Ou usar docker-compose diretamente
docker-compose up -d
```

### 3. Configuração do Prisma

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Ou executar migrations
npm run db:migrate
```

### 4. Setup Completo (Recomendado)

```bash
# Comando que faz tudo: sobe Docker + configura Prisma
npm run setup
```

## 🖥️ Executando o Sistema

### Desenvolvimento

```bash
# Frontend (Next.js) - Porta 3000
npm run dev

# Backend (NestJS) - Porta 3001
npm run dev:backend

# Ambos simultaneamente
npm run dev:all
```

## 🗄️ Banco de Dados

### Acesso ao PostgreSQL

- **Host**: localhost
- **Porta**: 5432
- **Database**: gestao_contabil
- **Usuário**: postgres
- **Senha**: postgres

### DBGate (Interface Web)

Acesse [http://localhost:3080](http://localhost:3080) para administrar o banco via interface web.

### Comandos Úteis

```bash
# Ver logs do banco
npm run docker:logs

# Reiniciar containers
npm run docker:restart

# Parar containers
npm run docker:down

# Prisma Studio (interface do Prisma)
npm run db:studio
```

## 📚 APIs

### Backend NestJS

- **URL Base**: http://localhost:3001/api
- **Documentação Swagger**: http://localhost:3001/api/docs

## 🌟 Funcionalidades

### ✅ Implementadas

- [x] Autenticação JWT
- [x] CRUD de Usuários
- [x] CRUD de Clientes/Empresas
- [x] CRUD de Documentos
- [x] Sistema de Obrigações Fiscais
- [x] Banco PostgreSQL com Docker
- [x] Interface de administração (DBGate)
- [x] Documentação Swagger
- [x] **Nova Sidebar com shadcn/ui**
  - [x] Navegação hierárquica com submenus
  - [x] Busca integrada na sidebar
  - [x] Funcionalidade de collapse/expand
  - [x] Breadcrumbs dinâmicos
  - [x] Indicadores de status com badges
  - [x] Responsividade completa
  - [x] Persistência de estado
  - [x] Acessibilidade otimizada

## 🎨 Interface e UX

### Nova Sidebar (shadcn/ui)

A interface foi completamente renovada com uma sidebar moderna e funcional:

#### **Características Principais:**
- **Navegação Hierárquica**: Organizada em grupos (Principal, Gestão, Fiscal, Relatórios, Administração)
- **Submenus Inteligentes**: Clientes, Documentos, Obrigações Fiscais e Configurações com subopções
- **Busca Integrada**: Filtro rápido de funcionalidades diretamente na sidebar
- **Breadcrumbs Dinâmicos**: Navegação contextual que mostra a localização atual
- **Indicadores Visuais**: Badges para mostrar contadores (ex: documentos pendentes, obrigações vencidas)

#### **Funcionalidades Avançadas:**
- **Collapse/Expand**: Sidebar colapsável para economizar espaço
- **Responsividade**: Comportamento otimizado para mobile, tablet e desktop
- **Persistência**: Estado da sidebar salvo no localStorage
- **Acessibilidade**: Suporte completo a navegação por teclado e screen readers
- **Animações Suaves**: Transições fluidas entre estados

### 🚧 Em Desenvolvimento

- [ ] Frontend Next.js (interfaces)
- [ ] Sistema de Notificações
- [ ] Portal do Cliente
- [ ] Relatórios e Analytics
