# Base de Estudos Next.js (Finnance App)

> Documento vivo para estudo contínuo.
>
> Data inicial: 10/03/2026

## 1) Perfil desta trilha (definido em 10/03/2026)

- prazo: 2 meses;
- disponibilidade: 4 horas por semana;
- nível atual: iniciante/intermediário em Next.js;
- foco principal: arquitetura;
- formato: sessões curtas diárias;
- contexto: aprender e refatorar neste projeto;
- direção técnica de UI: abordagem com componentes;
- entregável por sessão: opcional (flexível).

## 2) Objetivo principal

Evoluir este projeto para um padrão de arquitetura profissional em Next.js (App Router), com foco em:

- arquitetura clara e escalável;
- qualidade de código;
- performance;
- acessibilidade;
- UX consistente.

## 3) Resultado esperado ao fim de 2 meses

Ao final do ciclo, o app deve:

- ter organização por domínio (features);
- usar Server Components por padrão;
- isolar Client Components somente quando houver interatividade real;
- ter base de componentes reutilizáveis (design system incremental);
- possuir fluxo mínimo de qualidade (typecheck, lint e testes prioritários).

## 4) Estado atual do projeto (snapshot)

- stack: Next.js 14 + TypeScript;
- estrutura ainda concentrada em poucos arquivos;
- já existem blocos interativos úteis para estudo;
- i18n inicial com JSON por idioma.

## 5) Princípios de arquitetura que vamos seguir

1. Separação por responsabilidade:
- rota/orquestração em `app/`;
- domínio em `features/`;
- componentes base em `components/ui/`;
- utilidades compartilhadas em `lib/`.

2. Server-first:
- começar em Server Component;
- promover para Client Component apenas com motivo técnico claro.

3. Baixo acoplamento:
- evitar arquivos gigantes;
- separar por domínio, não por tipo genérico.

4. Componentes consistentes:
- construir componentes reutilizáveis com API pequena e previsível;
- evoluir gradualmente para base compatível com Radix Primitives.

5. Qualidade contínua:
- mudanças pequenas;
- validação incremental;
- decisões registradas no fim de cada sessão.

## 6) Estrutura-alvo sugerida

```txt
src/
  app/
    (dashboard)/
    (marketing)/
    api/
  features/
    dashboard/
    wallet/
    transactions/
    goals/
  components/
    ui/
  lib/
    i18n/
    seo/
    analytics/
    utils/
  styles/
    tokens.css
    globals.css
```

## 7) Cadência semanal (4 horas)

- 5 sessões curtas por semana;
- 35 a 45 minutos por sessão;
- alvo de 3h a 3h45 no total;
- 15 a 60 minutos restantes para revisão semanal e notas.

Sugestão prática:

- segunda a sexta: 1 sessão curta por dia;
- sábado ou domingo: revisão rápida da semana (opcional).

## 8) Trilhas de estudo (ordem recomendada)

### Trilha A: App Router e organização

- layouts, nested routes e route groups;
- loading.tsx, error.tsx, not-found.tsx;
- metadata por segmento.

### Trilha B: Arquitetura por feature

- fronteiras entre `app`, `features`, `components/ui` e `lib`;
- contratos de tipos entre camadas;
- extração de componentes por contexto de negócio.

### Trilha C: Server vs Client

- regras para decidir renderização;
- impacto de hidratação e bundle;
- estados interativos isolados.

### Trilha D: Componentes e design system

- tokens de design;
- primitives de UI reutilizáveis;
- acessibilidade de teclado/foco como requisito.

### Trilha E: Qualidade de entrega

- typecheck + lint;
- testes nos blocos interativos críticos;
- disciplina de mudanças pequenas com validação.

## 9) Roadmap personalizado (8 semanas)

### Semana 1 — Mapa de arquitetura atual

- mapear blocos atuais por responsabilidade;
- identificar componentes candidatos a extração;
- definir convenções de naming e pastas.

### Semana 2 — Fundações do App Router

- revisar e aplicar layouts/segmentos;
- definir padrão para loading/error/not-found;
- padronizar metadata no projeto.

### Semana 3 — Modularização por domínio (parte 1)

- separar dashboard em fatias por feature;
- reduzir responsabilidades de arquivo de página;
- reforçar tipagem dos contratos.

### Semana 4 — Modularização por domínio (parte 2)

- consolidar fronteiras entre camadas;
- revisar dependências cruzadas;
- reduzir acoplamento entre blocos.

### Semana 5 — Arquitetura de componentes

- iniciar biblioteca `components/ui`;
- padronizar API de componentes básicos;
- definir critérios para adoção de primitives.

### Semana 6 — Sistema visual incremental

- consolidar tokens (cores, spacing, tipografia);
- reduzir CSS global e mover estilos para escopo correto;
- melhorar consistência entre seções.

### Semana 7 — Robustez técnica

- validar server/client boundaries;
- adicionar testes para interações-chave;
- revisar regressões de UX e acessibilidade.

### Semana 8 — Consolidação e revisão final

- revisar ganhos arquiteturais;
- documentar decisões finais;
- fechar backlog do próximo ciclo.

## 10) Checklist de cada sessão

Antes:

- objetivo da sessão em 1 frase;
- escopo da sessão (entra / não entra);
- risco principal.

Durante:

- manter foco em 1 tema arquitetural;
- registrar decisões e tradeoffs.

Depois:

- anotar o que foi aprendido;
- registrar decisão tomada;
- definir próximo passo mínimo;
- marcar se houve entregável no dia (sim ou não).

## 11) Template de registro diário

```md
## Sessão YYYY-MM-DD

### Tempo total

-

### Objetivo da sessão

-

### Conceitos estudados

-

### Decisões arquiteturais

-

### Entregável do dia

- sim / não
- se sim, qual:

### Dúvidas abertas

-

### Próximo passo

-
```

## 12) Regras de decisão (anti-retrabalho)

Quando surgir dúvida de arquitetura:

1. reduz complexidade daqui a 3 meses?
2. melhora legibilidade para outra pessoa do time?
3. mantém performance e acessibilidade?
4. evita dependência desnecessária?

Se a maioria for "não", adiar.

## 13) Backlog de estudo do projeto (arquitetura-first)

- definir fronteira clara entre server/client;
- quebrar arquivo de página em blocos de feature;
- estruturar `components/ui` para abordagem por componentes;
- reduzir CSS global e distribuir estilos por responsabilidade;
- revisar i18n para escalar por rota/segmento;
- padronizar estados de loading/error/empty.

## 14) Métricas de evolução

- tempo para entender e editar uma feature;
- redução de arquivos monolíticos;
- aumento de componentes reutilizados;
- redução de bugs visuais/funcionais;
- evolução de cobertura dos fluxos críticos.

## 15) Acordo de trabalho (nós dois)

- foco em progresso contínuo;
- uma decisão arquitetural de cada vez;
- teoria sempre conectada ao código real do projeto;
- sem pressa para "perfeição", com disciplina de evolução.
