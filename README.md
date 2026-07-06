# Bil — Fórum Q&A

Aplicação de referência full-stack de um fórum de perguntas e respostas, com back-end em NestJS (Clean Architecture) e front-end em React + Vite. Monorepo gerenciado com pnpm workspaces + Turborepo.

- [`backend/`](backend/README.md) — API NestJS, Prisma/PostgreSQL, Redis, JWT.
- [`frontend/`](frontend) — SPA em React + Vite.

## Como iniciar o projeto (desenvolvimento)

O `docker-compose.yml` na raiz sobe apenas a infraestrutura de apoio (PostgreSQL e Redis); backend e frontend rodam localmente através do Turborepo.

1. Suba a infraestrutura:

    ```bash
    docker compose up -d
    ```

2. Instale as dependências de todo o monorepo (a partir da raiz):

    ```bash
    pnpm install
    ```

3. Configure o backend (`backend/.env`, a partir de `backend/.env.example`) e rode as migrações do Prisma:

    ```bash
    cd backend
    pnpm prisma migrate dev
    cd ..
    ```

4. Inicie backend e frontend juntos:

    ```bash
    pnpm dev
    ```

A API fica disponível em `http://localhost:3333` e o frontend em `http://localhost:5173` (padrão do Vite).

## Scripts do monorepo

- `pnpm dev` — sobe backend e frontend em modo desenvolvimento (via Turborepo).
- `pnpm build` — builda todos os pacotes.
- `pnpm lint` — roda o lint em todos os pacotes.
- `pnpm test` — roda os testes de todos os pacotes.

Para rodar um comando em um único pacote, use o filtro do pnpm, ex: `pnpm --filter bil-backend test:e2e`.

## Portas usadas em desenvolvimento

| Serviço              | Porta  |
| --------------------- | ------ |
| Backend (NestJS)       | `3333` |
| Frontend (Vite)        | `5173` |
| PostgreSQL (Docker)     | `5432` |
| Redis (Docker)          | `6379` |

Antes de `turbo run dev`, o script `predev` ([scripts/free-ports.mjs](scripts/free-ports.mjs)) mata automaticamente qualquer processo já escutando nas portas `3333` e `5173`. Isso evita o erro `EADDRINUSE` quando uma instância anterior do `pnpm dev` fica órfã (por exemplo, um terminal fechado sem encerrar o processo) e você roda `pnpm dev` de novo — não é mais necessário matar processos manualmente antes de reiniciar.

Se precisar liberar as portas manualmente por algum outro motivo:

```bash
node scripts/free-ports.mjs 3333 5173
```
