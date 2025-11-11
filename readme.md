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

## Próximos passos sugeridos

- Persistência com banco PostgreSQL ou MongoDB.
- Integração real com APIs de pagamentos e WhatsApp.
- Camada de autorização baseada em papéis/permissões.
- Testes automatizados (unitários e end-to-end).
