# Relatorio de Mas Praticas

Escopo da varredura:
- Codigo-fonte em `app/`, `scripts/` e `docs/`.
- Artefatos gerados em `.next/` apenas para confirmar nomes de classe compilados.
- `node_modules/` excluido.

Checks executados:
- `npm run lint:css` -> passou
- `node scripts/lint-layout.mjs` -> passou

Observacao importante:
- Nomes como `.GoalTrackerCard_goal-tracker-card__SrLBH` aparecem em `.next/static/css/app/page.css` e sao saida normal do CSS Modules compilado.
- Isso nao e o problema principal a corrigir no codigo-fonte.
- O problema real e quando a equipe passa a depender desses nomes compilados para inspecao, debug ou regras de estilo.
- Atualizacao em 2026-03-19:
  - os componentes visuais passaram a expor `data-slot` semantico estavel no DOM.
  - a hash do CSS Modules continua existindo no build, mas deixou de ser o contrato humano de inspecao.

## Lista para resolver

### Alta prioridade

- [ ] Remover o utilitario global de debug `.upload-area` com `!important`.
  - Arquivo: `app/globals.css:204`
  - Problema: override global agressivo e visual falso para placeholders.
  - Evidencia:
    - `background-color: #ff9ecf !important;`
    - `background-image: none !important;`
  - Uso atual: 7 ocorrencias no `app/` sendo 1 definicao global + 6 call sites
  - Call sites:
    - `app/components/WalletPanel.tsx:89`
    - `app/components/WalletPanel.tsx:112`
    - `app/components/dashboard/DashboardTopBar.tsx:72`
    - `app/components/dashboard/GoalTrackerCard.tsx:40`
    - `app/components/dashboard/SpendingLimitCard.tsx:23`
    - `app/components/dashboard/TransactionsCard.tsx:58`

- [ ] Remover placeholder visual acidental `color: #f00` no titulo da carteira.
  - Arquivo: `app/components/WalletPanel.module.css:33`
  - Problema: hardcode de debug/placeholder vazando para a UI real.

- [ ] Substituir links falsos `href="#"` na sidebar.
  - Arquivo: `app/components/dashboard/DashboardSidebar.tsx`
  - Problema: navegacao quebrada, ruido semantico e UX falsa.
  - Total: 9 ocorrencias
  - Exemplos:
    - `app/components/dashboard/DashboardSidebar.tsx:26`
    - `app/components/dashboard/DashboardSidebar.tsx:41`
    - `app/components/dashboard/DashboardSidebar.tsx:50`
    - `app/components/dashboard/DashboardSidebar.tsx:59`
    - `app/components/dashboard/DashboardSidebar.tsx:71`
    - `app/components/dashboard/DashboardSidebar.tsx:77`
    - `app/components/dashboard/DashboardSidebar.tsx:83`
    - `app/components/dashboard/DashboardSidebar.tsx:89`
    - `app/components/dashboard/DashboardSidebar.tsx:95`

- [ ] Tirar estilos dinamicos triviais do JSX quando houver alternativa estrutural melhor.
  - Total: 6 ocorrencias
  - Arquivos:
    - `app/components/BalanceChart.tsx:288`
    - `app/components/dashboard/SpendingLimitCard.tsx:29`
    - `app/components/dashboard/GoalTrackerCard.tsx:64`
    - `app/components/dashboard/CostAnalysisCard.tsx:38`
    - `app/components/dashboard/CostAnalysisCard.tsx:49`
    - `app/components/dashboard/FinancialHealthCard.tsx:39`
  - Problema: parte da apresentacao esta espalhada no JSX em vez de ficar concentrada em tokens, classes ou variaveis CSS.

### Media prioridade

- [ ] Normalizar overflow abreviado proibido pelo proprio guideline do projeto.
  - Total: 2 ocorrencias
  - Arquivos:
    - `app/components/WalletPanel.module.css:119`
    - `app/components/dashboard/TransactionsCard.module.css:71`
  - Problema: `overflow: hidden auto` reduz legibilidade do layout e o proprio `docs/CODEX_FRONTEND_RULES.md` manda declarar eixos separadamente.

- [ ] Revisar todos os `overflow: hidden;` para confirmar que nao estao mascarando bug de layout.
  - Total: 18 ocorrencias
  - Problema: o guideline do projeto proibe usar clipping para esconder problema estrutural.
  - Arquivos representativos:
    - `app/globals.css:199`
    - `app/components/BalanceChart.module.css:10`
    - `app/components/WalletPanel.module.css:65`
    - `app/components/dashboard/DashboardSidebar.module.css:12`
    - `app/components/dashboard/GoalTrackerCard.module.css:13`
    - `app/components/dashboard/FinancialHealthCard.module.css:95`

- [ ] Reduzir duplicacao do shell base de cards.
  - Evidencia:
    - `padding: var(--dashboard-card-padding);` aparece 9x
    - `border-radius: var(--radius-sm);` aparece 17x
    - `height: 100%;` aparece 17x
    - `min-height: 0;` aparece 30x
  - Arquivos representativos:
    - `app/components/BalanceChart.module.css:2`
    - `app/components/WalletPanel.module.css:2`
    - `app/components/dashboard/CostAnalysisCard.module.css:2`
    - `app/components/dashboard/FinancialHealthCard.module.css:2`
    - `app/components/dashboard/GoalTrackerCard.module.css:5`
    - `app/components/dashboard/SpendingLimitCard.module.css:2`
    - `app/components/dashboard/TransactionsCard.module.css:2`
    - `app/components/dashboard/VariableExpensesCard.module.css:2`
    - `app/components/dashboard/VerticalKpiPanel.module.css:2`
  - Problema: o projeto repete a mesma moldura de card manualmente em vez de ter uma base previsivel.

- [ ] Revisar o padrao `grid-template-rows: auto minmax(0, 1fr)`.
  - Total: 6 ocorrencias
  - Arquivos:
    - `app/components/dashboard/GoalTrackerCard.module.css:11`
    - `app/components/dashboard/GoalTrackerCard.module.css:47`
    - `app/components/dashboard/GoalTrackerCard.module.css:56`
    - `app/components/dashboard/SpendingLimitCard.module.css:8`
    - `app/components/dashboard/TransactionsCard.module.css:8`
    - `app/components/dashboard/TransactionsCard.module.css:47`
  - Problema: o proprio `scripts/lint-layout.mjs` trata esse padrao como algo a evitar e hoje ele so passa porque algumas partes viraram legado/allowlist.

- [ ] Remover `inline-size: max-content` legado do card de metas.
  - Arquivo: `app/components/dashboard/GoalTrackerCard.module.css:103`
  - Problema: sizing pouco previsivel e explicitamente desencorajado pelo lint estrutural.

### Baixa prioridade, mas vale limpar

- [ ] Tokenizar cores repetidas que hoje estao duplicadas entre TSX e CSS.
  - Caso mais claro: grafico principal
    - `app/components/BalanceChart.tsx:56`
    - `app/components/BalanceChart.module.css:139`
    - `app/components/BalanceChart.module.css:143`
    - `app/components/BalanceChart.module.css:147`
    - `app/components/BalanceChart.module.css:159`
    - `app/components/BalanceChart.module.css:163`
    - `app/components/BalanceChart.module.css:167`
  - Cores repetidas:
    - `#e5ea42`
    - `#9bd95a`
    - `#f3b56c`
    - `#cbcbcb`

- [ ] Consolidar hardcodes visuais compartilhados que ainda nao viraram token.
  - Exemplos:
    - `app/components/dashboard/DashboardSidebar.module.css:91` -> `#f7f7f7`
    - `app/components/dashboard/DashboardTopBar.module.css:257` -> `#f7f7f7`
    - `app/components/dashboard/GoalTrackerCard.module.css:42` -> `#d8d8d8`
  - Problema: o projeto diz para priorizar tokens, mas alguns valores recorrentes seguem soltos.

- [ ] Revisar gradientes e paleta solta por componente.
  - Arquivos com muitos hardcodes:
    - `app/components/dashboard/TransactionsCard.module.css`
    - `app/components/dashboard/CostAnalysisCard.module.css`
    - `app/components/dashboard/GoalTrackerCard.module.css`
    - `app/components/dashboard/FinancialHealthCard.tsx`
    - `app/components/dashboard/DashboardTopBar.module.css`
  - Problema: a identidade visual esta espalhada em dezenas de valores literais, o que dificulta tema, ajuste fino e consistencia.

- [ ] Tratar `.next/` e `tsconfig.tsbuildinfo` como artefatos de build, nao como alvo de manutencao manual.
  - Evidencia:
    - `.next/static/css/app/page.css` contem classes compiladas como `.GoalTrackerCard_goal-tracker-card__SrLBH`
    - `tsconfig.tsbuildinfo` existe na raiz do projeto
  - Problema: esses arquivos poluem leitura do sistema se forem tratados como fonte.

## Resumo curto

O sistema nao esta quebrado no lint atual, mas tem divida real em tres frentes:
- placeholders/debug vazando para UI real
- repeticao estrutural nos cards
- hardcodes visuais fora de tokens

## Ordem sugerida de correcao

1. Remover `.upload-area`, `!important`, `#f00` e `href="#"`.
2. Extrair um shell base de card para reduzir repeticao.
3. Tokenizar paleta repetida e limpar hardcodes recorrentes.
4. Revisar legados allowlisted de layout (`overflow`, `auto minmax(0, 1fr)`, `max-content`).
