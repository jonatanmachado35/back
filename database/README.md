# Database Setup

Este diretório contém o schema do banco de dados PostgreSQL para o ZapNutre.

## Como executar no Supabase

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse o dashboard do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `schema.sql`
6. Cole no editor SQL
7. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)

### Opção 2: Via CLI do Supabase

Se você tem o Supabase CLI instalado:

```bash
# Na raiz do projeto back
supabase db reset

# Ou execute o schema diretamente
psql -h db.wfssimpiekvaihgbrvse.supabase.co \
     -U postgres \
     -d postgres \
     -f database/schema.sql
```

### Opção 3: Via psql (PostgreSQL Client)

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.wfssimpiekvaihgbrvse.supabase.co:5432/postgres" -f database/schema.sql
```

## O que o schema cria?

### Tabelas

1. **usuarios** - Usuários do sistema (pacientes, nutricionistas, admins)
2. **planos** - Planos de assinatura
3. **registros_pacientes** - Registros de saúde e dieta dos pacientes
4. **pagamentos** - Transações de pagamento
5. **anamnese** - Questionários de avaliação nutricional

### Recursos

- ✅ UUIDs automáticos para IDs
- ✅ Timestamps automáticos (created_at, updated_at)
- ✅ Triggers para atualizar updated_at
- ✅ Índices para otimização de queries
- ✅ Foreign keys com CASCADE/SET NULL apropriados
- ✅ Row Level Security (RLS) policies
- ✅ Comentários nas tabelas e colunas
- ✅ Seed data com planos padrão

### Dados iniciais (Seed)

O schema cria automaticamente 3 planos:
- **Free Trial** - R$ 0,00/mês
- **Premium Patient** - R$ 29,90/mês
- **Professional** - R$ 99,90/mês

O usuário admin será criado automaticamente quando a API iniciar pela primeira vez:
- Email: `admin@zapnutre.com`
- Senha: `ChangeMe123` (⚠️ LEMBRE-SE DE MUDAR!)

## Verificação

Após executar o schema, você pode verificar se tudo está correto:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Verificar planos criados
SELECT * FROM plans;

-- Verificar RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

## Troubleshooting

### Erro: "permission denied"
Certifique-se de estar usando as credenciais corretas do Supabase. Você pode encontrá-las em:
- Dashboard → Settings → Database → Connection string

### Erro: "relation already exists"
O schema possui `DROP TABLE IF EXISTS` no início. Se precisar recriar manualmente:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Depois execute o schema.sql novamente.

### Tabelas não aparecem na API
1. Verifique se as tabelas foram criadas: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
2. Reinicie a aplicação: `yarn start:dev`
3. Verifique os logs da aplicação

## Migrations futuras

Para futuras alterações no banco de dados, crie arquivos de migration na pasta `migrations/`:

```
database/
├── schema.sql          (schema inicial)
├── migrations/
│   ├── 001_add_column_example.sql
│   ├── 002_create_index_example.sql
│   └── ...
└── README.md
```
