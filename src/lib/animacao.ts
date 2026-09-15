/**
 * O motor de animação, isolado num módulo só para poder ser adiado.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTE ARQUIVO EXISTE, SENDO UMA LINHA                         │
 * │                                                                       │
 * │  O `LazyMotion` do App precisa buscar os recursos por `import()`, e a │
 * │  primeira tentativa foi chamar `import('motion/react')` direto lá.    │
 * │  O resultado foi o OPOSTO do pretendido: o chunk de entrada passou de │
 * │  145 kB para 171 kB comprimidos.                                      │
 * │                                                                       │
 * │  O motivo é uma regra do empacotador: quando o MESMO módulo é         │
 * │  importado de forma estática e dinâmica, ele desiste de separar e     │
 * │  põe tudo no pedaço estático — a união dos dois usos, que aqui é o    │
 * │  pacote inteiro. E o App importa `motion/react` estaticamente, porque │
 * │  é de lá que vêm `LazyMotion` e `MotionConfig`.                       │
 * │                                                                       │
 * │  Com os recursos atrás deste módulo, os dois lados deixam de ser o    │
 * │  mesmo arquivo: o que fica no caminho crítico é a interface (9 kB     │
 * │  comprimidos, medidos), e o motor vira pedaço próprio, buscado        │
 * │  depois da hidratação.                                                │
 * │                                                                       │
 * │  ⚠ NÃO importe nada daqui de forma estática. Uma linha dessas desfaz  │
 * │  a separação inteira, sem erro de build e sem aviso — só o tamanho    │
 * │  do chunk de entrada denuncia. É o que o teto em `scripts/smoke.mjs`  │
 * │  existe para acusar.                                                  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * É `domMax`, e não o `domAnimation` mais enxuto, por causa de um recurso
 * só: a lista de avaliações anima `layout` quando um item entra ou sai, e
 * animação de layout não está no pacote menor. Com `domAnimation` o
 * atributo não daria erro — ele apenas deixaria de animar, e a lista
 * voltaria a saltar em vez de acomodar.
 */
export { domMax } from 'motion/react';
