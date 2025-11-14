# ZapNutre API

API modular construída com [NestJS](https://nestjs.com) para sustentar o ecossistema ZapNutre, incluindo experiências de usuários finais (B2C), nutricionistas e administradores da plataforma.

## Visão Geral

A API está estruturada por domínios de negócio, garantindo separação de responsabilidades e facilitando futuras integrações com bancos de dados, filas e provedores externos.

### Módulos implementados

- **Auth** – Registro e autenticação JWT para todos os perfis da plataforma.
- **Users** – Cadastro e gestão de usuários com papeis (`patient`, `nutritionist`, `admin`).
- **Patients** – Armazena prontuários, métricas de saúde, registros alimentares e metas.
- **Plans** – Catálogo dos planos B2C e profissionais, incluindo lógica de comissões/descontos.
- **Payments** – Orquestra cobranças via gateways configuráveis (ex.: Pagar.me, Stripe).
- **Notifications** – Envio de mensagens WhatsApp simuladas, com suporte a templates.
- **Anamnesis** – Coleta de anamnese/quiz inicial para personalizar planos nutricionais.
- **Analytics** – Indicadores de uso, receita e métricas agregadas de pacientes.

## Requisitos

- Node.js 18+
- npm 9+

## Executando o projeto

```bash
npm install
npm run start:dev
```

A API expõe os endpoints em `http://localhost:3000` (ou na porta configurada via `PORT`).

## Scripts disponíveis

| Script            | Descrição                                           |
| ----------------- | --------------------------------------------------- |
| `npm run start`   | Executa a aplicação compilada (`dist`).             |
| `npm run start:dev` | Executa a aplicação em modo desenvolvimento com recarga. |
| `npm run build`   | Compila os arquivos TypeScript para `dist/`.        |
| `npm run lint`    | Executa checagem de tipos TypeScript.               |

## Configuração

Variáveis de ambiente suportadas:

- `PORT` – Porta HTTP (padrão: `3000`).
- `JWT_SECRET` – Segredo para assinatura JWT (padrão apenas para desenvolvimento).
- `JWT_EXPIRES_IN` – Tempo de expiração do token (ex.: `1h`).
- `SUPABASE_URL` – URL do projeto Supabase (aceita também `VITE_SUPABASE_URL`).
- `SUPABASE_SERVICE_ROLE_KEY` – Chave service role utilizada pelo backend (aceita também `SUPABASE_SERVICE_KEY` ou `VITE_SUPABASE_SERVICE_ROLE_KEY`).
- `SUPABASE_ANON_KEY` – Opcional; fallback para ambientes sem service role (aceita também `VITE_SUPABASE_ANON_KEY`).

O módulo **Users/Auth** lê e grava diretamente na tabela `users` do banco Supabase (PostgreSQL). Garanta que as colunas citadas nos DTOs existam e que as políticas de RLS permitam as operações do backend (idealmente utilizando a service role key).

## Próximos passos sugeridos

- Persistência com banco PostgreSQL ou MongoDB.
- Integração real com APIs de pagamentos e WhatsApp.
- Camada de autorização baseada em papéis/permissões.
- Testes automatizados (unitários e end-to-end).
