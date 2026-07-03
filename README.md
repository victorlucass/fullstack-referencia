# fullstack-referencia

Pasta de referência de arquitetura, montada a partir de dois projetos de estudo (Rocketseat Ignite) **de domínios diferentes** — não formam um produto único. O objetivo é usar os padrões de código de cada um (backend e frontend, separadamente) como modelo para projetos futuros.

## Estrutura

```
.
├── backend/   # API NestJS — Clean Architecture / DDD (copiado de 05-nest-clean, domínio: fórum Q&A)
├── frontend/  # SPA React (clonado de ignite-reactjs-04-pizzashop-web, domínio: pizzaria)
└── docs/      # Documentação gerada sobre os projetos (arquitetura, planos de modernização, etc.)
```

## backend/

API de fórum Q&A em NestJS, seguindo Clean Architecture / DDD tático (camadas `core` → `domain` → `infra`, Either/Result, Domain Events, Repository pattern). Detalhes completos em [docs/backend-arquitetura.pdf](docs/backend-arquitetura.pdf).

## frontend/

SPA em React (Vite + TypeScript) do case Pizza Shop. Domínio diferente do backend acima — está aqui só como referência de estrutura/padrões de frontend, não para ser ligado ao backend de fórum.

## docs/

Documentação de apoio gerada durante a análise dos projetos — diagnóstico de arquitetura, dependências e planos de modernização.
