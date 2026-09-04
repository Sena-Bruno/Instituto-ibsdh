# Decisões do Biome

Três regras foram desligadas. Cada uma por um motivo específico deste
projeto, não por conveniência:

**`suspicious/noArrayIndexKey`** — a regra existe para evitar bug de
reconciliação quando uma lista é reordenada, filtrada ou tem itens
removidos. As 27 ocorrências aqui são listas de conteúdo estático
declaradas dentro do próprio JSX (benefícios, módulos do curso, ícones):
nunca mudam de ordem nem de tamanho depois de renderizadas. Onde os dados
são dinâmicos — as avaliações vindas do Firestore — a chave já é o `id` do
documento.

**`complexity/noImportantStyles`** — os quatro `!important` estão no bloco
`@media (prefers-reduced-motion: reduce)` do `index.css`. Ali eles são a
prática recomendada: a regra precisa vencer qualquer `animation` ou
`transition` declarada depois, e sem `!important` a preferência do
visitante seria ignorada.

**`suspicious/noConsole` em `scripts/` e `netlify/`** — no teste de fumaça
o `console.log` é a saída do programa, e na função do Netlify o
`console.error` é o que chega ao painel de logs. Continua ativo em `src/`,
onde um `console.log` esquecido é ruído no navegador do visitante.
