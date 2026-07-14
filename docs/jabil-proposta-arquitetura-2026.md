# Proposta de Arquitetura Técnica — Aderência à Guideline de TI da EMS IT

**Preparado para:** Jabil
**Elaborado por:** Victor Lucas — Engenheiro Fullstack Sênior
**Data:** 14/07/2026 (revisão 4 — documento reestruturado no formato de aderência à Guideline de TI da EMS IT)

---

## Sumário executivo

Este documento apresenta a arquitetura do projeto de referência **Bil** — um **dashboard de OEE (Overall Equipment Effectiveness) para linha de produção SMT** da Jabil, com autenticação de usuários e acompanhamento de paradas (downtime) — organizada **item a item conforme a Guideline de TI da EMS IT**, no mesmo formato usado pela Jabil para avaliar a proposta original (Item da Guideline → Arquitetura Proposta → Aderência → Adequações).

A revisão anterior deste documento foi avaliada pela Jabil e recebeu um parecer com 6 itens em "Não atende" e 6 em "Parcial", de 18 itens avaliados. Esta revisão incorpora o plano de adequação de cada um desses itens diretamente na arquitetura proposta, para que o documento sirva como a proposta final a ser submetida — não mais como um registro do que já existe no repositório hoje.

**Como ler a tabela abaixo:** a coluna "Aderência" reflete o **compromisso da proposta ajustada**, não necessariamente o que já está codificado neste momento no repositório. Onde a implementação ainda não foi feita, isso é dito explicitamente na coluna "Plano de implementação", com a tecnologia concreta escolhida — não uma recomendação genérica.

---

## 1. Aderência à Guideline de TI da EMS IT

| # | Item da Guideline EMS IT | Arquitetura Proposta | Aderência | Plano de implementação |
|---|---|---|---|---|
| 1 | Arquitetura em camadas | Clean Architecture + DDD tático (`core` / `domain` / `infra`) | **Atende** | Já implementado no backend (`backend/src/core`, `backend/src/domain`, `backend/src/infra`). Ver detalhe na seção 2.1. |
| 2 | Separação de responsabilidades | Core (genérico) / Domain (regra de negócio) / Infra (detalhe técnico) | **Atende** | Regra: dependência sempre aponta para dentro — `domain` não conhece Prisma, Redis ou NestJS, só interfaces. Ver seção 2.1. |
| 3 | Dependency Injection | NestJS DI nativo | **Atende** | Container de DI do próprio framework, sem biblioteca adicional. Ver seção 2.2. |
| 4 | Padrões de Projeto (GoF) | Repository, Factory, Strategy, Adapter | **Atende** | `UsersRepository` (Repository), `Encrypter`/`HashComparer` (Strategy), `Uploader`/`CacheRepository` (Adapter). Ver seção 2.2. |
| 5 | Qualidade de código | Vitest + ESLint + Prettier **+ SonarQube/SonarCloud** | **Atende (com adequação)** | Manter Vitest/ESLint/Prettier e **adicionar SonarQube/SonarCloud** com Quality Gate (cobertura mínima, complexidade ciclomática, duplicação de código) bloqueando merge. Ver seção 3. |
| 6 | SonarQube obrigatório | SonarQube/SonarCloud integrado ao pipeline | **Atende (com adequação)** | Integração ao Azure DevOps Pipeline com Quality Gate obrigatório antes do merge para a branch principal. Ver seção 3. |
| 7 | Logging corporativo | Winston (ou Pino) com log estruturado | **Atende (com adequação)** | Substituir o `ConsoleLogger` padrão do Nest por logging estruturado com níveis, Correlation ID/Request ID e integração com a ferramenta de monitoramento da Jabil. Ver seção 4. |
| 8 | Tratamento de exceções | Either Pattern (regra de negócio) + Global Exception Filter (exceção inesperada) | **Atende (com adequação)** | Either já implementado para erro de negócio; **adicionar** `GlobalExceptionFilter` do NestJS para exceção não tratada, com resposta HTTP padronizada. Ver seção 2.3. |
| 9 | Internacionalização (i18n) | react-i18next (frontend) + Accept-Language (backend) | **Atende (com adequação)** | Externalizar toda mensagem/validação para arquivo de recurso. Ver seção 5. |
| 10 | Documentação XML | Não aplicável a stack Node/TypeScript | **N/A — equivalente proposto** | TypeDoc/JSDoc + OpenAPI (Swagger) como equivalente funcional ao padrão de documentação XML do .NET. Ver seção 6. |
| 11 | Convenções de nomenclatura | PascalCase / camelCase | **Atende** | Já aplicado em todo o código (classes em PascalCase, variáveis/métodos em camelCase). |
| 12 | Banco ACID | PostgreSQL 17 | **Atende** | Já implementado via Prisma ORM. Ver seção 2.1. |
| 13 | CI/CD | Pipeline completo no Azure DevOps | **Atende (com adequação)** | Build → Testes → SonarQube → Dependency/Security Scan → artefato versionado → aprovação de release → deploy DEV/QA/UAT/Produção. Ver seção 7. |
| 14 | Code Review | Pull Request obrigatório antes do merge | **Atende** | Já previsto no fluxo de trabalho da equipe. |
| 15 | Testes automatizados | Unit (Vitest) + E2E (Playwright/Vitest e2e) | **Atende** | Já implementado — use cases testados com repositórios fake em memória, sem depender de banco/infra. Ver seção 2.1. |
| 16 | Observabilidade | OpenTelemetry + Prometheus + Grafana/Azure Monitor | **Atende (com adequação)** | Health checks, métricas, dashboards e distributed tracing. Ver seção 8. |
| 17 | Auditoria | Audit Trail dedicado | **Atende (com adequação)** | Registro de usuário, timestamp, operação, dado antes/depois e origem da requisição para operações críticas. Ver seção 9. |
| 18 | Segurança | JWT RS256 + RBAC + OAuth2/OIDC + Key Vault + Rate Limiting + OWASP | **Atende (com adequação)** | JWT RS256 já implementado; **adicionar** RBAC, avaliação de SSO corporativo, cofre de segredos, rate limiting e checklist OWASP Top 10. Ver seção 10. |

**Resultado consolidado:** dos 18 itens, **7 já atendem hoje sem nenhuma adequação** (itens 1, 2, 3, 4, 11, 12, 14, 15 — arquitetura, DI, padrões de projeto, nomenclatura, banco, code review e testes) e **10 passam a atender com a adequação descrita** nas seções técnicas abaixo (itens 5, 6, 7, 8, 9, 13, 16, 17, 18), restando **1 item não aplicável à stack** (documentação XML, item 10) com equivalente proposto.

---

## 2. Backend — o que já atende hoje

### 2.1 Arquitetura em camadas, separação de responsabilidades e banco ACID (itens 1, 2, 12)

Usamos **Clean Architecture + DDD tático**:

```
infra  →  domain  →  core
(detalhe)  (regra)   (genérico)
```

> **As dependências apontam sempre para dentro.** O núcleo de regras de negócio não sabe que Postgres, Redis ou NestJS existem — ele só conhece interfaces (contratos).

Fisicamente no repositório: `backend/src/core`, `backend/src/domain`, `backend/src/infra`.

| Área | Tecnologia | Versão instalada | Observação |
|---|---|---|---|
| Framework | NestJS | **10.x** | Módulos, DI e decorators nativos |
| Linguagem | TypeScript | **5.1** | `target: es2022`, `strict: true` |
| ORM / Banco | Prisma **5.2** + **PostgreSQL 17** | Banco ACID (item 12) já implementado | Schema hoje tem a tabela `users`; domínio de OEE/downtime a modelar |
| Cache | Redis 7 + **ioredis 5.3** | `RedisCacheRepository` implementa interface `CacheRepository` genérica — cache-aside, TTL 15 min | |
| Autenticação | JWT **RS256** via `@nestjs/jwt` + `passport-jwt` | Chave assimétrica, guard global (`JwtAuthGuard`) | Ver adequação de segurança na seção 10 |
| Validação | **Zod v3** + `zod-validation-error` | Valida `env` e payload do JWT | |
| Upload/Storage | Storage local em disco atrás de interface `Uploader` | Trocável por S3/R2 sem tocar em regra de negócio | |
| Testes | **Vitest 0.34** (unit) + config separada e2e | Item 15 (testes automatizados) | |
| Package manager | **pnpm** via **Turborepo 2.5** | Monorepo `backend` + `frontend` | |

**Ganho concreto (itens 1, 2 e 15 juntos):** testes de use case usam repositórios fake em memória (`test/repositories`), rodam em segundos, sem depender de banco ou Redis.

### 2.2 Dependency Injection e Padrões de Projeto — GoF (itens 3, 4)

```ts
@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository, // Repository — interface, não implementação
    private hashComparer: HashComparer,       // Strategy
    private encrypter: Encrypter,             // Strategy
  ) {}

  async execute({ email, password }: AuthenticateUserUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) return left(new WrongCredentialsError())

    const isPasswordValid = await this.hashComparer.compare(password, user.password)
    if (!isPasswordValid) return left(new WrongCredentialsError())

    const accessToken = await this.encrypter.encrypt({ sub: user.id.toString() })
    return right({ accessToken })
  }
}
```

`UsersRepository` é uma classe abstrata definida no `domain` (padrão **Repository**). `HashComparer`/`Encrypter` são interfaces de estratégia (padrão **Strategy**), injetadas via DI nativo do NestJS. Quem implementa de fato (Prisma em produção, fake em memória em teste) mora em `infra`/`test/repositories` — o use case nunca importa Prisma. `Uploader` (storage) e `CacheRepository` (Redis) seguem o mesmo molde de **Adapter**: a regra de negócio depende só da interface.

### 2.3 Tratamento de exceções (item 8)

Use cases retornam um tipo `Either<Erro, Sucesso>` (`backend/src/core/either.ts`) em vez de usar `throw` para erro de regra de negócio:

```ts
export class Left<L, R> {
  constructor(readonly value: L) {}
  isLeft(): this is Left<L, R> { return true }
  isRight(): this is Right<L, R> { return false }
}

export class Right<L, R> {
  constructor(readonly value: R) {}
  isLeft(): this is Left<L, R> { return false }
  isRight(): this is Right<L, R> { return true }
}

export type Either<L, R> = Left<L, R> | Right<L, R>
```

**Por quê:** o próprio tipo de retorno do use case documenta todo erro possível daquela operação. O TypeScript obriga quem chama a checar `isLeft()` antes de usar o valor.

**Adequação para atender integralmente o item 8:** o Either cobre erro de negócio esperado; falta o tratamento padronizado de exceção *inesperada* (falha de infra, bug). Proposta: um `GlobalExceptionFilter` (`@Catch()` do NestJS) capturando qualquer exceção não tratada, padronizando o corpo de resposta HTTP (código, mensagem amigável, `traceId`), logando automaticamente o stack trace e nunca vazando detalhe interno para o cliente. O Either continua sendo a forma de modelar erro de negócio — o filtro global é a rede de segurança para o que escapar dele.

### 2.4 Eventos de domínio

A infraestrutura de eventos de domínio (`core/events/domain-events.ts`, `AggregateRoot.addDomainEvent`) já existe no `core`, pronta para quando o domínio de OEE precisar — por exemplo, notificar alguém quando uma parada de linha ultrapassar um limite de tempo, ou alimentar o Audit Trail (seção 9) como consumidor de eventos.

---

## 3. Qualidade de código e SonarQube (itens 5 e 6)

Hoje: Vitest (testes), ESLint (lint) e Prettier (formatação), sem análise estática de qualidade/segurança.

**Adequação proposta:** integrar **SonarQube (ou SonarCloud)** ao pipeline de CI/CD (seção 7), com Quality Gate cobrindo:

- Cobertura mínima de testes (definir percentual-alvo com a Jabil, sugestão inicial: 80% em `domain`/`core`);
- Complexidade ciclomática por método/função;
- Duplicação de código;
- SAST (Static Application Security Testing) — vulnerabilidades conhecidas no próprio código;
- Bloqueio obrigatório de merge para a branch principal enquanto o Quality Gate não passar.

---

## 4. Logging corporativo (item 7)

Hoje o backend usa o `ConsoleLogger` padrão do NestJS (log não estruturado, sem correlação entre requisições).

**Adequação proposta:**

- Logging estruturado com **Winston** ou **Pino** (formato JSON, pronto para ingestão por ferramenta corporativa);
- Níveis padronizados: `Information`, `Warning`, `Error`, `Debug`;
- **Correlation ID** e **Request ID** gerados por requisição (middleware) e propagados em toda a cadeia de log daquela chamada;
- Rastreamento de exceções (integrado ao `GlobalExceptionFilter` da seção 2.3);
- Centralização e integração com a solução de monitoramento corporativa da Jabil — **Azure Monitor**, CloudWatch ou ELK, a confirmar qual já está homologada na Jabil.

---

## 5. Internacionalização — i18n (item 9)

Hoje as telas e mensagens de validação estão hardcoded em PT-BR, sem camada de i18n.

**Adequação proposta:**

- Frontend: **react-i18next**, com todo texto de UI migrado de string literal para chave de tradução em arquivo de recurso (`pt-BR.json`, `en-US.json` conforme necessidade da Jabil);
- Backend: suporte a header `Accept-Language`, com mensagens de erro/validação (hoje geradas pelo Zod) também externalizadas para arquivo de recurso, em vez de string fixa no código.

---

## 6. Documentação (item 10 — N/A, equivalente proposto)

O padrão de documentação XML da guideline é específico do ecossistema .NET e não se aplica a uma stack TypeScript/NestJS. Equivalente funcional proposto:

- **TypeDoc**/**JSDoc** para documentação de código (classes, use cases, interfaces de domínio);
- **OpenAPI (Swagger)** gerado a partir dos controllers NestJS, documentando todo endpoint HTTP exposto — contrato de request/response, códigos de erro e autenticação necessária.

---

## 7. CI/CD (item 13)

Hoje não existe pipeline configurado no repositório.

**Adequação proposta — pipeline no Azure DevOps** (ferramenta já usada pela EMS IT, substituindo a alternativa GitHub Actions cogitada anteriormente):

1. **Build** — backend e frontend via Turborepo;
2. **Testes automatizados** — unit + e2e (Vitest/Playwright);
3. **SonarQube** — Quality Gate (seção 3);
4. **Dependency Scan / Security Scan (SAST)**;
5. **Geração de artefato versionado**;
6. **Aprovação manual de release** (gate por ambiente);
7. **Deploy automatizado** entre os ambientes **DEV → QA → UAT → Produção**.

---

## 8. Observabilidade (item 16)

Hoje não há instrumentação de observabilidade — apenas log de console.

**Adequação proposta:**

- **OpenTelemetry** para instrumentação de traces e métricas;
- **Health Checks** (`/health`) para orquestrador/monitoramento de infraestrutura;
- **Métricas** via Prometheus (latência, taxa de erro, throughput por endpoint);
- **Dashboards** em Grafana ou Azure Monitor, a definir com o time de infraestrutura da Jabil;
- **Distributed Tracing** cobrindo a cadeia requisição → use case → banco/cache, essencial para troubleshooting em produção.

---

## 9. Auditoria (item 17)

Hoje não existe Audit Trail — nenhuma operação crítica é registrada de forma auditável.

**Adequação proposta:** mecanismo de **Audit Trail** dedicado (tabela própria, apartada do log de aplicação), registrando para cada operação crítica do domínio de OEE/downtime:

- Usuário que executou a ação;
- Data/hora da operação;
- Operação executada (ex.: "resolução de evento de parada");
- Dado alterado, no formato **Before/After**;
- Origem da requisição (IP, user agent, ou canal de origem).

Este mecanismo pode nascer como consumidor dos eventos de domínio já existentes na infraestrutura (`DomainEvents`, seção 2.4), mantendo o use case desacoplado da lógica de auditoria.

---

## 10. Segurança (item 18)

Hoje: autenticação via JWT **RS256** com chave assimétrica e guard global (`JwtAuthGuard`), com rotas públicas via decorator `@Public()`.

**Adequações propostas para atendimento integral:**

- **RBAC (Role-Based Access Control)**: modelar papéis (ex.: operador de linha, supervisor, admin) com guard/decorator de autorização por papel — hoje qualquer usuário autenticado acessa qualquer rota protegida;
- **OAuth2/OpenID Connect**: avaliar com o time de infra da Jabil se é necessário federar com IdP corporativo (ex.: Azure AD/Entra ID) para SSO, em vez de manter apenas login local email/senha;
- **Gerenciamento seguro de segredos**: migrar `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY` e credenciais de banco de variável de ambiente para cofre gerenciado (**Azure Key Vault** ou **AWS Secrets Manager**), com política de rotação de chaves;
- **Rate Limiting**: `@nestjs/throttler` (ou equivalente) nas rotas de autenticação, no mínimo, para mitigar força bruta;
- **Proteção OWASP Top 10**: validação de entrada já via Zod; adicionar headers de segurança (`helmet`), CORS restritivo por ambiente e proteção contra IDOR nas rotas de OEE/downtime;
- **Criptografia de dados sensíveis** em repouso, onde aplicável;
- **Auditoria de autenticação e autorização**: tentativas de login, falhas e mudanças de permissão alimentando o Audit Trail (seção 9), não apenas o log de aplicação.

---

## 11. Frontend — stack de apoio

Para completude, a stack de frontend (não avaliada item a item pela guideline, mas que sustenta as telas que consomem o backend acima):

| Área | Tecnologia | Versão instalada |
|---|---|---|
| Framework | **React** | **18.2** |
| Build tool | **Vite** | **5.0** |
| Linguagem | TypeScript | **5.2** |
| Roteamento | **React Router DOM** | **6.21** |
| Estado de servidor | **TanStack Query** | **5.17** |
| Formulários | `react-hook-form` **7.49** + Zod v3 | |
| Design system | shadcn/ui sobre **Radix UI** | Componentes copiados para o repo, não pacote fechado |
| Estilo | **Tailwind CSS 3.3** | |
| Testes | **Vitest 1.2** + Testing Library + **Playwright 1.41** (e2e) | |
| Mock de API | **MirageJS 0.1.48** | Única fonte de dados das telas de OEE/downtime até o backend de domínio existir |

Todo dado vindo da API passa por `useQuery`/`useMutation` do TanStack Query — nunca em `useState` global ou Context solto. Cliente HTTP único: `bilApi` (`frontend/src/lib/bil-api.ts`), instância `axios` com `withCredentials: true`.

Telas hoje implementadas: **Dashboard** (KPIs de OEE, tendência, composição, Pareto de paradas), **Downtime** (histórico e resolução de paradas) e **Auth** (login/cadastro).

---

## 12. Itens de domínio ainda em aberto (fora do escopo da guideline de TI)

Independente da aderência à guideline, dois pontos de domínio seguem em aberto e não devem ser confundidos com os itens 1–18 acima:

1. **Backend do domínio de OEE/downtime não existe ainda.** O schema Prisma só tem `users`; as métricas de OEE e o histórico de downtime hoje vêm do mock MirageJS. É o próximo módulo de domínio a modelar (linha, equipamento, evento de parada, cálculo OEE = disponibilidade × performance × qualidade).
2. **Storage em disco local.** A interface `Uploader` já isola isso — migrar para S3/R2 é só trocar a implementação, sem tocar em use case, caso seja necessário anexar evidência/foto a um evento de parada.

---

## Conclusão

Com as adequações descritas nas seções 3 a 10, a proposta passa a atender **17 dos 18 itens da Guideline de TI da EMS IT** (o único item fora do escopo direto, documentação XML, tem equivalente funcional proposto na seção 6). Os itens que exigem adequação (5, 6, 7, 8, 9, 13, 16, 17, 18) têm tecnologia e abordagem concretas definidas acima — não pendências em aberto sem direção. Pontos que dependem de decisão conjunta com a Jabil (ferramenta de monitoramento corporativa, necessidade de SSO via IdP corporativo, percentual de cobertura mínima do Quality Gate) estão sinalizados explicitamente em cada seção correspondente.
