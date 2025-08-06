-- Script de inicialização do PostgreSQL para Sistema de Gestão Contábil
-- Este script é executado automaticamente quando o container é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER gestao_app WITH PASSWORD 'gestao_app_password';
-- GRANT ALL PRIVILEGES ON DATABASE gestao_contabil TO gestao_app;

-- Log de inicialização
SELECT 'Database gestao_contabil initialized successfully!' as status;
