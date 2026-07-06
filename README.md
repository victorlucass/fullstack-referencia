# Bil — Fórum Q&A

Aplicação de referência full-stack de um fórum de perguntas e respostas, com back-end em NestJS (Clean Architecture) e front-end em React + Vite.

- [`backend/`](backend/README.md) — API NestJS, Prisma/PostgreSQL, Redis, JWT.
- [`frontend/`](frontend) — SPA em React + Vite.

## Como iniciar o projeto (desenvolvimento)

O `docker-compose.yml` na raiz sobe apenas a infraestrutura de apoio (PostgreSQL e Redis); backend e frontend rodam localmente.

1. Suba a infraestrutura:

    ```bash
    docker compose up -d
    ```

2. Configure o backend (`backend/.env`, a partir de `backend/.env.example`) e instale as dependências:

    ```bash
    cd backend
    pnpm install
    pnpm prisma migrate dev
    pnpm start:dev
    ```

3. Em outro terminal, configure e inicie o frontend:

    ```bash
    cd frontend
    pnpm install
    pnpm dev
    ```

A API fica disponível em `http://localhost:3333` e o frontend em `http://localhost:5173` (padrão do Vite).
