/**
 * Regras para a mensagem de commit.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE NÃO CONVENTIONAL COMMITS, E COMO LIGAR SE QUISER             │
 * │                                                                       │
 * │  O histórico deste repositório usa dois estilos em partes quase        │
 * │  iguais: metade com prefixo (`feat:`, `fix:`) e metade com frase       │
 * │  imperativa em português — "Publica os três artigos", "Pré-renderiza   │
 * │  as rotas". Exigir o prefixo hoje reprovaria o estilo de metade dos    │
 * │  commits que já estão aqui, incluindo os mais descritivos.             │
 * │                                                                       │
 * │  Então as regras abaixo são só de higiene: o que vale para os dois     │
 * │  estilos e o que de fato incomoda quem lê o histórico depois. O        │
 * │  prefixo fica permitido, nunca obrigatório.                           │
 * │                                                                       │
 * │  PARA EXIGIR CONVENTIONAL COMMITS: instale                            │
 * │  `npm i -D @commitlint/config-conventional`, acrescente               │
 * │  `extends: ['@commitlint/config-conventional']` e apague o             │
 * │  `parserPreset` abaixo. Vale a pena no dia em que você quiser gerar    │
 * │  changelog ou versionar a partir das mensagens — é para isso que o     │
 * │  prefixo serve, e sem esse uso ele é só cerimônia.                    │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default {
  /**
   * O parser padrão do commitlint só reconhece `tipo: assunto`. Numa
   * mensagem em frase livre ele não encontra o assunto — e o efeito prático
   * é o contrário do pretendido: a regra `subject-empty` passa a reprovar
   * justamente o estilo em português que se queria permitir. Verificado
   * rodando a configuração contra as vinte últimas mensagens do repositório,
   * onde onze foram reprovadas por "subject may not be empty".
   *
   * Este padrão torna o prefixo opcional: com ele, `type` e `scope` são
   * preenchidos como de hábito; sem ele, a frase inteira é o assunto. Assim
   * as regras de assunto valem nos dois estilos.
   */
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?:(\w+)(?:\(([^)]*)\))?: )?(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },

  /* O primeiro número de cada regra é a severidade: 0 desliga, 1 avisa,
     2 reprova. */
  rules: {
    /*
      80, e não os 72 de praxe: quatro commits do próprio histórico têm entre
      74 e 76 caracteres, e reprovar um commit pronto por dois caracteres é
      exatamente o que ensina a usar `--no-verify` — que desligaria o gancho
      inteiro, esta regra incluída.
    */
    'header-max-length': [2, 'always', 80],

    /* O assunto tem de dizer algo. "wip", "ajustes" e "correções" obrigam
       quem investiga uma regressão a abrir o diff para saber o que mudou. */
    'header-min-length': [2, 'always', 15],
    'subject-empty': [2, 'never'],

    /* Ponto final em título de commit é ruído: a linha já termina. */
    'subject-full-stop': [2, 'never', '.'],

    /* Sem a linha em branco, `git log` emenda assunto e corpo — e a primeira
       linha deixa de resumir o commit. */
    'body-leading-blank': [2, 'always'],

    /*
      Aviso, não erro, nos dois abaixo. A linha em branco antes do rodapé é o
      que faz o git reconhecer `Co-Authored-By` como trailer, então vale
      lembrar; mas dois commits do histórico passam batido nisso, e nenhum
      deles ficou pior por causa disso. Linha longa no corpo tem o mesmo
      caráter: incomoda no terminal, e uma URL não tem como ser quebrada.
    */
    'footer-leading-blank': [1, 'always'],
    'body-max-line-length': [1, 'always', 100],

    /* O prefixo é opcional — ver o bloco acima —, mas quando existe tem de
       ser um dos conhecidos, para não surgirem `feature:`, `bugfix:` e
       `hotfix:` significando a mesma coisa. */
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore'],
    ],
    'type-empty': [0],
    'subject-case': [0],
  },
};
