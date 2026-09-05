/**
 * Os vídeos do site.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  COMO COLOCAR UM VÍDEO NO AR                                          │
 * │                                                                       │
 * │  Preencha a entrada correspondente aqui embaixo. Não há mais nada a   │
 * │  fazer: a página se reorganiza sozinha para receber o vídeo.          │
 * │                                                                       │
 * │  Do YouTube — copie só o identificador, não a URL inteira:            │
 * │      youtube.com/watch?v=ABC123xyz  →  { tipo: 'youtube', id:         │
 * │      'ABC123xyz' }                                                    │
 * │                                                                       │
 * │  Do Vimeo — o número que aparece no fim do endereço:                  │
 * │      vimeo.com/987654321  →  { tipo: 'vimeo', id: '987654321' }       │
 * │                                                                       │
 * │  Arquivo próprio — coloque o .mp4 em `public/` e aponte a rota:       │
 * │      { tipo: 'arquivo', src: '/boas-vindas.mp4' }                     │
 * │                                                                       │
 * │  O `poster` é a imagem que aparece antes de alguém dar play. Se você  │
 * │  não passar nenhuma, cada espaço usa a imagem que já faz sentido ali  │
 * │  (o retrato no hero, por exemplo).                                    │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ENQUANTO ESTIVER `null`, nada quebra e nada fica com cara de buraco: o
 * hero volta a mostrar o retrato do Bruno, e a seção do SENA mostra só o
 * simulador interativo. O espaço não é anunciado antes de existir.
 */

export type Video =
  | { tipo: 'youtube'; id: string; poster?: string }
  | { tipo: 'vimeo'; id: string; poster?: string }
  | { tipo: 'arquivo'; src: string; poster?: string };

export const midia = {
  /**
   * O vídeo de boas-vindas, no alto da home.
   *
   * É o lugar mais valioso da página, e vídeo do fundador falando é o que
   * mais constrói confiança num instituto — mais do que qualquer bloco de
   * texto que ocupe o mesmo espaço.
   *
   * Sugestão de conteúdo, em 60 a 90 segundos: quem é você, por que o
   * instituto existe, e o que a pessoa leva ao final da formação. Sem
   * introdução longa — os primeiros 5 segundos decidem se assistem.
   */
  boasVindas: null as Video | null,

  /**
   * A amostra real do SENA, na seção do simulador.
   *
   * Uma gravação de tela de uma sessão de verdade — você conduzindo um
   * atendimento com um paciente virtual e recebendo a devolutiva.
   *
   * É a peça que falta para o argumento fechar: hoje a seção mostra uma
   * demonstração que eu construí, útil para o visitante experimentar a
   * mecânica, mas que não é o produto. Com a gravação real, a demonstração
   * passa a ser o convite e o vídeo passa a ser a prova.
   */
  amostraSena: null as Video | null,
} satisfies Record<string, Video | null>;
