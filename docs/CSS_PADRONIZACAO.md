# Padronizacao de CSS - Finnance App

## Objetivo
- Reduzir estilo "caso a caso" sem quebrar o layout atual.
- Garantir consistencia para novas features.

## Convencoes
- Classe CSS em `kebab-case`.
- Variavel CSS em `--kebab-case`.
- Priorizar tokens (`var(--...)`) para cor, tipografia, borda e espacamento.
- Evitar `!important`; usar somente quando houver motivo tecnico claro.
- Evitar hex literal em novos blocos quando ja existir token equivalente.

## Estrutura de estilos
- `app/globals.css`: tokens, reset, layout base e estilos compartilhados.
- Estilos de componentes devem usar prefixo do dominio (ex: `wallet-*`, `transaction-*`).
- Nomes legados em portugues (`pagina`, `conteudo`, `bloco`, `topo`) podem ser mantidos por compatibilidade; classes novas devem seguir dominio semantico.
- Componentes visuais devem expor hooks semanticos estaveis no DOM para inspeção.
  - Preferir `data-slot` com nome semantico estavel.
  - Classe semantica legivel no `className` fica como excecao, nao como padrao.

## Arquitetura de layout
- Spacing precisa ter dono claro. Evitar a mesma distancia controlada em mais de um nivel.
- Preferir stack vertical simples ou Flex para fluxos lineares.
- Usar Grid somente quando houver relacao bidimensional real.
- Evitar `grid-template-rows: auto minmax(0, 1fr)` em componentes sem justificativa tecnica.
- Evitar `inline-size: max-content` em containers de layout.
- Evitar `overflow: hidden` para mascarar problemas de layout.
- Evitar `overflow: hidden auto` e `overflow: auto hidden`; declarar os eixos separadamente.
- Controles que devem seguir o tamanho do conteudo nao devem receber `width: 100%`.

## Fluxo obrigatorio para mudancas de UI
1. Identificar qual elemento e o dono do layout/spacing.
2. Alterar somente a camada dona do problema.
3. Validar no inspect com hooks semanticos legiveis.
4. Rodar lint estrutural alem do lint de CSS.

## Governanca
- Lint de CSS: `npm run lint:css`.
- Auto-fix de CSS: `npm run lint:css:fix`.
- Lint estrutural de layout: `npm run lint:layout`.
- Check combinado de frontend: `npm run lint:frontend`.
- Configuracao central: `stylelint.config.mjs`.
- Contrato operacional para agentes: `docs/CODEX_FRONTEND_RULES.md`.

## Ordem de estudo recomendada
1. Box model e sizing intrinseco
   - `content-box`, `border-box`, `width`, `height`, `min/max`, `fit-content`, `max-content`, `min-content`.
2. Flexbox e Grid de verdade
   - `align-items`, `justify-items`, `align-content`, `justify-content`, `auto`, `1fr`, `minmax(0, 1fr)`, `auto-fit`, `auto-fill`.
3. Overflow e scroll containers
   - `min-height: 0`, `min-width: 0`, `overflow`, `scrollbar-gutter`.
   - Esse ponto e central para o dashboard.
4. CSS Box Alignment
   - A maior parte dos nudges com `margin-top: 2px` nasce de alinhamento mal resolvido no container.
5. Arquitetura de CSS para apps com componentes
   - Neste projeto: `CSS Modules` + tokens globais + zero regra global de dominio.
6. Cascade, especificidade e heranca
   - Para evitar "por que esse estilo apareceu aqui?" e tambem para parar de lutar com DevTools/HMR.
7. DevTools de layout
   - Aprender a ler `content box`, `padding`, `track` de grid, `flex item stretch`, `computed styles` e `matched rules`.

## Plano incremental
1. Consolidar tokens repetidos no `:root`.
2. Substituir hardcodes repetidos por tokens.
3. Extrair blocos grandes para CSS Modules por componente (sem alterar visual).
4. Remover classes legadas em portugues somente apos migracao completa do markup.

## Status atual
- Fase 1 concluida: tokens e regras base padronizadas em `app/globals.css`.
- Fase 2 parcial concluida:
  - `app/components/BalanceChart.module.css`
  - `app/components/WalletPanel.module.css`
- Proxima extracao recomendada: bloco de transacoes e blocos de metas.
