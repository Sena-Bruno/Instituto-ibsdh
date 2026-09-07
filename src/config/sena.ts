/**
 * O conteúdo da amostra do SENA na home.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  O TEXTO CLÍNICO É RASCUNHO — PENDENTE DE REVISÃO DO BRUNO         │
 * │                                                                       │
 * │  A resposta de referência e, principalmente, a devolutiva com nota    │
 * │  foram redigidas como proposta de estrutura, não como material        │
 * │  didático aprovado. É a única parte do site que emite julgamento      │
 * │  clínico, e ela sai assinada pelo instituto.                          │
 * │                                                                       │
 * │  Revise antes de divulgar. O texto vive aqui, separado da marcação,   │
 * │  exatamente para que revisar seja editar prosa, e não mexer em JSX.   │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ── Por que a amostra foi refeita ───────────────────────────────────────
 *
 * A versão anterior era um teste de múltipla escolha: o paciente falava e o
 * visitante escolhia uma entre três respostas prontas. O SENA de verdade
 * (simulador.institutobrunosena.com.br) não funciona assim. Nele o aluno
 * ESCREVE a intervenção com as próprias palavras — mínimo de 50 caracteres,
 * por texto ou por voz — e uma IA devolve uma nota e a análise da condução.
 *
 * Uma amostra que ensina a mecânica errada é pior do que não ter amostra:
 * quem se matricula esperando um quiz encontra outra coisa.
 *
 * ── Onde a amostra para, e por quê ──────────────────────────────────────
 *
 * A amostra reproduz o produto até o ponto em que o produto começa a
 * pensar. Ela mostra o paciente real, aceita o texto livre com a mesma
 * regra de tamanho e apresenta a autoavaliação, que no SENA vem antes da
 * IA. Aí ela para e mostra uma resposta de REFERÊNCIA já avaliada.
 *
 * A nota exibida é a da resposta de referência, nunca a do visitante — e a
 * tela diz isso com todas as letras. Avaliar de verdade exige a IA do
 * simulador, e inventar uma nota para o texto de quem está de fora seria
 * mentir sobre o produto logo na demonstração dele.
 */

/** O que o SENA pede antes de a IA entrar: o aluno julga a própria condução. */
export interface ItemAutoavaliacao {
  id: string;
  texto: string;
}

export const sena = {
  /** Onde o aluno matriculado usa o SENA de verdade. */
  url: 'https://simulador.institutobrunosena.com.br/',

  /**
   * O paciente virtual da amostra.
   *
   * Os campos são os mesmos do simulador: identificação, perfil, descrição,
   * resistências esperadas e a abordagem recomendada para o perfil. No
   * produto o paciente é sorteado a cada sessão; aqui é fixo, para que a
   * amostra seja sempre a mesma conversa.
   */
  paciente: {
    id: 'PV-014',
    perfil: 'Cético',
    descricao:
      'Paciente cético, testa a competência do profissional antes de se entregar ao processo. Já passou por outras abordagens sem resultado e chega esperando mais uma decepção.',
    resistencias: [
      'Pede evidências',
      'Testa autoridade',
      'Compara com tentativas anteriores',
      'Desistência rápida',
    ],
    abordagem:
      'Credibilização rápida, referenciação, convite à experiência direta, menos promessas.',
    falaInicial:
      'Sinceramente, não sei se isso vai funcionar. Já tentei de tudo e essas técnicas parecem muito teóricas.',
    /** O estado emocional do paciente, de 0 a 100, como a barra do simulador. */
    estado: { rotulo: 'Abertura ao processo', valor: 22 },
  },

  /** Os limites de tamanho da resposta, iguais aos do simulador. */
  minimoCaracteres: 50,
  maximoCaracteres: 5000,

  /**
   * A autoavaliação que o SENA pede antes de acionar a IA.
   *
   * Os seis itens são os do simulador, na mesma ordem. Existe para o aluno
   * julgar a própria condução antes de receber a nota — sem isso a nota
   * vira placar, e o aluno aprende a agradar o avaliador em vez de a
   * conduzir a sessão.
   */
  autoavaliacao: [
    { id: 'rapport', texto: 'Estabeleci rapport e conexão com o perfil do paciente' },
    {
      id: 'perfil',
      texto: 'Identifiquei e adaptei minha condução ao perfil clínico sorteado',
    },
    { id: 'tecnica', texto: 'Apliquei uma técnica ou estratégia compatível com esta aula' },
    {
      id: 'resistencia',
      texto: 'Manejei as resistências específicas do paciente adequadamente',
    },
    {
      id: 'etica',
      texto: 'Mantive postura ética e respeitei os limites do papel profissional',
    },
    { id: 'avanco', texto: 'Validei se houve avanço ou mudança antes de encerrar' },
  ] satisfies ItemAutoavaliacao[],

  /**
   * A resposta de referência e a devolutiva dela.
   *
   * É o que a amostra mostra no lugar de avaliar o texto do visitante. A
   * nota é desta resposta, e a tela diz isso.
   */
  referencia: {
    resposta:
      'Faz sentido você estar em dúvida — se já tentou várias coisas sem resultado, desconfiar é o que qualquer pessoa sensata faria. Não vou te pedir para acreditar em nada. Vamos fazer um teste pequeno agora, de dois minutos, e você julga pelo que sentir, não pelo que eu disser.',
    nota: 9.2,
    notaMinima: 8,
    rotulo: 'Condução adequada',
    blocos: [
      {
        tipo: 'good' as const,
        titulo: 'Acolheu a objeção antes de propor',
        texto:
          'A dúvida foi validada como reação razoável, não como obstáculo a vencer. Com perfil cético é o que abre espaço: ele não questionou a técnica, questionou a própria capacidade de mudar.',
      },
      {
        tipo: 'good' as const,
        titulo: 'Devolveu o critério ao paciente',
        texto:
          '"Você julga pelo que sentir" transfere a autoridade para ele. É a abordagem recomendada para este perfil — convite à experiência direta, menos promessas.',
      },
      {
        tipo: 'mid' as const,
        titulo: 'Ponto de atenção: o prazo prometido',
        texto:
          'Dizer "dois minutos" cria um compromisso mensurável. Se o exercício passar disso, o paciente cético registra a quebra e a credibilidade cai. Prefira "um teste curto".',
      },
    ],
  },
} as const;
