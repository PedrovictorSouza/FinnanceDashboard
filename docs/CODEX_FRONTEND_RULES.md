# Regras Operacionais de Frontend

## Objetivo
- Impedir que mudancas de UI/CSS sejam resolvidas com estrutura confusa ou dificil de inspecionar.
- Transformar arquitetura de layout em regra verificavel, nao em preferencia subjetiva.

## Regras obrigatorias para qualquer agente
- Antes de editar layout, identificar qual elemento e o dono real do espacamento.
- Nao espalhar o mesmo espacamento em multiplos niveis do componente.
- Nao usar Grid quando Flex ou uma stack vertical simples resolverem o layout.
- Nao usar `grid-template-rows: auto minmax(0, 1fr)` em componente sem justificativa tecnica explicita.
- Nao usar `inline-size: max-content` em containers de layout sem justificativa tecnica explicita.
- Nao usar `overflow: hidden auto` ou `overflow: auto hidden`; declarar os eixos explicitamente.
- Nao usar `overflow: hidden` para esconder bug de layout.
- Nao usar `width: 100%` em controles que devem ter tamanho do proprio conteudo.
- Todo componente visual precisa expor hooks semanticos estaveis no DOM para inspecao.
  - Preferencia 1: `data-slot` com nome semantico.
  - Preferencia 2: classe semantica estavel quando houver motivo tecnico real.
- Todo ajuste de spacing deve ter dono claro:
  - espacamento entre blocos do card
  - espacamento entre grupos
  - espacamento entre itens
  - espacamento interno do item
- Se a estrutura estiver confusa, parar e refatorar antes de continuar o styling.

## Checklist antes de editar UI
1. Qual elemento controla o espacamento que eu quero mudar?
2. Esse espacamento ja esta sendo controlado em outro nivel?
3. Estou usando Grid porque preciso de relacao bidimensional ou por habito?
4. O DOM vai continuar legivel no Inspect depois da mudanca?
5. O componente vai continuar previsivel sem depender de clipping/overflow para "funcionar"?

## Checklist de entrega
1. Explicar qual elemento era o dono do espacamento/layout.
2. Explicar qual propriedade foi alterada e por que ela e a dona correta.
3. Rodar `npm run lint:css`.
4. Rodar `npm run lint:layout`.
5. Se houver excecao estrutural, registrar motivo no proprio CSS com comentario de waiver.

## Waiver permitido
- Formato:
  `/* layout-lint-disable-next-line <rule-id> -- motivo objetivo */`
- So usar quando houver restricao real de produto, biblioteca, acessibilidade ou compatibilidade.
- "Funciona visualmente" nao e motivo suficiente.
