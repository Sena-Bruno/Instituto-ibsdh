/**
 * Os artigos do instituto.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTA SEÇÃO EXISTE                                            │
 * │                                                                       │
 * │  Até aqui o site tinha sete páginas, todas de venda. Isso responde a  │
 * │  quem já decidiu comprar uma formação e procura qual — mas é uma      │
 * │  fração minúscula das buscas. A maioria das pessoas chega antes:      │
 * │  "o que é PNL", "hipnose funciona mesmo", "metamodelo da linguagem".  │
 * │  Para essas buscas o site não tinha nenhuma página, e quem responde   │
 * │  hoje são os concorrentes que estão no ar há anos.                    │
 * │                                                                       │
 * │  Um artigo não vende no primeiro clique, e não é para vender. Ele     │
 * │  responde à pergunta e apresenta o instituto a quem ainda não sabia   │
 * │  que precisava de uma formação.                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  A REGRA QUE NÃO PODE SER QUEBRADA                                 │
 * │                                                                       │
 * │  Desde a atualização de março de 2024, a Google pune o que chama de  │
 * │  "abuso de conteúdo em escala": páginas produzidas em volume que      │
 * │  apenas reescrevem o que já existe indexado. A punição é de domínio,  │
 * │  não de página — leva o site inteiro junto.                           │
 * │                                                                       │
 * │  O que separa um artigo útil de conteúdo de enchimento não é o        │
 * │  tamanho nem a palavra-chave: é ter algo que só este instituto pode   │
 * │  dizer. Aqui isso existe e é concreto — as ementas, o simulador       │
 * │  SENA, os módulos de ética obrigatória, a experiência clínica do      │
 * │  Bruno. Artigo que não traz nada disso é melhor não publicar.         │
 * │                                                                       │
 * │  POR ISSO EXISTE O CAMPO `revisado`. Um artigo só vai ao ar depois    │
 * │  de o Bruno ler, corrigir e acrescentar o que só ele sabe. Enquanto   │
 * │  for `false`, ele não entra na listagem, não entra no sitemap e sai   │
 * │  com `noindex` — existe apenas para ser revisado.                     │
 * └───────────────────────────────────────────────────────────────────────┘
 */

/** Um pedaço de artigo. Formato fechado de propósito: texto puro em vez de
 *  JSX mantém a edição ao alcance de quem escreve, não de quem programa. */
export type Bloco =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'citacao'; texto: string; autor?: string }
  /** Caixa de destaque. Use para o aviso que a pessoa não pode deixar de ler. */
  | { tipo: 'destaque'; titulo?: string; texto: string };

export interface Artigo {
  /** Vira a URL: /artigos/<slug>. Não mude depois de publicado. */
  slug: string;
  titulo: string;
  /** O <title> da aba e do resultado de busca. Até ~60 caracteres. */
  tituloSeo?: string;
  /** A meta descrição e o resumo do card. Entre 120 e 158 caracteres. */
  resumo: string;
  /** A pergunta que este artigo responde. Só documentação, não vai ao ar. */
  buscaAlvo: string;
  /** ISO 8601. `datePublished` do schema e ordem da listagem. */
  publicadoEm: string;
  /** ISO 8601. Atualize ao revisar o texto — é o `dateModified`. */
  revisadoEm?: string;
  /** Eixo a que o artigo pertence; define a cor e o curso relacionado. */
  eixo: 'pnl' | 'hipnoterapia' | 'coaching';
  /** Rota da formação que o artigo naturalmente leva a considerar. */
  cursoRelacionado?: string;
  /**
   * `false` enquanto o Bruno não revisou. Ver o aviso no topo do arquivo:
   * artigo não revisado fica fora da listagem, fora do sitemap e com
   * `noindex`. É rascunho, não publicação.
   */
  revisado: boolean;
  corpo: Bloco[];
}

/* ────────────────────────────────────────────────────────────────────────
   OS ARTIGOS

   Escritos a partir das ementas em `curriculos.ts` e marcados como não
   revisados. O que falta em cada um está anotado num comentário — é
   sempre a mesma coisa: o caso concreto que só quem atendeu pode contar.
   ──────────────────────────────────────────────────────────────────── */

export const artigos: Artigo[] = [
  {
    slug: 'o-que-e-pnl',
    titulo: 'O que é PNL, e o que ela não é',
    tituloSeo: 'O que é PNL: o que a Programação Neurolinguística faz e o que não faz',
    resumo:
      'A PNL estuda como a linguagem organiza a experiência e como padrões de comportamento podem ser mudados. Não é terapia nem ciência médica, e entender essa fronteira é o que separa o profissional sério do charlatão.',
    buscaAlvo: 'o que é PNL / PNL funciona / para que serve a PNL',
    publicadoEm: '2026-09-07',
    revisadoEm: '2026-09-07',
    eixo: 'pnl',
    cursoRelacionado: '/pnl-practitioner',
    revisado: true,
    corpo: [
      {
        tipo: 'paragrafo',
        texto:
          'PNL é a sigla de Programação Neurolinguística. O nome soa a laboratório, e é aí que começa a maior parte da confusão: ele descreve uma proposta, não uma credencial científica. A PNL nasceu nos anos 1970, quando Richard Bandler e John Grinder decidiram fazer uma pergunta simples sobre terapeutas que obtinham resultados muito acima da média: **o que exatamente eles fazem?**',
      },
      {
        tipo: 'paragrafo',
        texto:
          'A resposta a essa pergunta é o que a PNL de fato é: um conjunto de modelos sobre como as pessoas organizam a própria experiência através da linguagem, e como esses padrões podem ser observados, descritos e alterados. É por isso que a modelagem é o coração do método, e não uma técnica entre outras.',
      },
      { tipo: 'subtitulo', texto: 'O pressuposto que sustenta o resto' },
      {
        tipo: 'paragrafo',
        texto:
          '"O mapa não é o território." É a frase mais repetida da área e a mais mal entendida. Ela não diz que a realidade não existe, nem que basta pensar diferente para que os fatos mudem. Diz que ninguém opera sobre a realidade diretamente: cada pessoa age sobre uma representação dela, montada a partir do que os sentidos captaram, do que a memória guardou e do que a linguagem conseguiu nomear.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Essa representação é construída por três operações que acontecem o tempo todo, sem que ninguém perceba: **omissão** (o que fica de fora), **distorção** (o que é reinterpretado) e **generalização** (o caso que vira regra). Elas não são defeitos. São o que torna a experiência administrável. O problema aparece quando o mapa fica pequeno demais para o território que a pessoa precisa atravessar.',
      },
      { tipo: 'subtitulo', texto: 'Um atendimento em que o problema não era o chefe' },
      {
        tipo: 'paragrafo',
        texto:
          'Uma cliente chegou dizendo que o problema era o chefe. Exigente demais, nunca dava feedback positivo, e por isso ela estava travada. Na superfície parecia um caso clássico de liderança tóxica. Mas o que ela repetia era outra coisa: "se eu pedir ajuda, ele vai pensar que sou incompetente e vou perder o espaço que conquistei". A fala pintava o chefe como carrasco; o mapa interno era uma regra rígida de que vulnerabilidade é sinônimo de fraqueza. Qualquer solução prática que eu sugerisse esbarrava num "mas isso não funciona com ele".',
      },
      {
        tipo: 'paragrafo',
        texto:
          'O que me chamou a atenção não foi o discurso. Foi a fisiologia. Cada vez que ela mencionava o chefe, a voz afinava, os ombros iam para a frente e ela desviava o olhar, como se estivesse encolhendo diante de uma ameaça real. Ali não havia nada sobre o comportamento dele. Era a forma como ela traduzia a realidade: generalizava uma ou duas experiências ruins como se fossem verdade absoluta, e apagava da memória todas as vezes em que ele tinha sido razoável. Enquanto esse filtro de "eu contra ele" estivesse de pé, qualquer técnica de comunicação ia falhar, porque o problema inteiro morava na interpretação e não nos fatos.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Então quebrei o padrão com uma pergunta meio torta: "se você pudesse cometer um erro de propósito amanhã, só para testar a reação dele, qual seria o menor e mais inofensivo?" Ela riu sem graça, mas a pergunta funcionou como um estalo. Na hora os ombros baixaram de verdade, e ela disse: "peraí, mas ele nunca me cobrou perfeição, fui eu que inventei isso".',
      },
      {
        tipo: 'paragrafo',
        texto:
          'O mapa se expandiu naquele instante. Ela passou a enxergar o chefe como um recurso que podia consultar, e não como um juiz de plantão. O cenário externo continuou exatamente o mesmo. O que mudou foi a energia dela: saiu da defensiva e foi direto para a ação, porque o problema tinha deixado de ser "ele" e virado "uma situação que eu consigo manejar".',
      },
      { tipo: 'subtitulo', texto: 'Os cinco canais, e por que isso importa na prática' },
      {
        tipo: 'paragrafo',
        texto:
          'A PNL chama de VAKOG os cinco sistemas por onde a experiência entra e é reconstruída: visual, auditivo, cinestésico, olfativo e gustativo. A observação prática é que as pessoas privilegiam canais diferentes ao pensar, e isso vaza na linguagem que usam.',
      },
      {
        tipo: 'lista',
        itens: [
          '"Não estou **vendo** saída para isso": a pessoa está construindo imagens.',
          '"Isso não me **soa** bem": a pessoa está ouvindo a própria fala interna.',
          '"Estou **travado** com essa decisão": a pessoa está descrevendo uma sensação corporal.',
        ],
      },
      {
        tipo: 'paragrafo',
        texto:
          'Quem conduz uma conversa terapêutica ou uma negociação e devolve a informação no mesmo canal em que ela veio é entendido mais rápido. É uma observação prática sobre atenção e linguagem, e funciona no dia a dia. Não é uma afirmação sobre como o cérebro está fisicamente organizado.',
      },
      { tipo: 'subtitulo', texto: 'O que a PNL não é' },
      {
        tipo: 'paragrafo',
        texto:
          'Aqui é onde a maior parte do material disponível na internet mente, por omissão ou por venda. Vale ser direto:',
      },
      {
        tipo: 'lista',
        itens: [
          '**Não é tratamento médico nem psiquiátrico.** Não substitui acompanhamento clínico, medicação ou psicoterapia conduzida por profissional habilitado.',
          '**Não tem respaldo científico como técnica clínica.** As revisões acadêmicas sobre PNL não sustentam as afirmações mais ambiciosas do campo. Quem promete o contrário está vendendo, não informando.',
          '**Não reprograma o cérebro.** A expressão é metáfora de marketing. O que se trabalha são padrões de linguagem, atenção e resposta emocional, o que já é bastante e não precisa de exagero.',
          '**Não é leitura de mente.** Pistas oculares, predicados e calibração são hipóteses a testar na conversa, nunca diagnósticos.',
        ],
      },
      {
        tipo: 'destaque',
        titulo: 'Por que dizemos isso numa página que vende formação',
        texto:
          'Porque a fronteira é o que torna o trabalho seguro. Um profissional que sabe o que a ferramenta não faz sabe quando encaminhar, e é exatamente esse julgamento que separa a prática responsável do dano. Nas nossas formações isso não é um aviso no rodapé: é módulo de ética com aprovação obrigatória.',
      },
      { tipo: 'subtitulo', texto: 'Então o que ela faz, afinal' },
      {
        tipo: 'paragrafo',
        texto:
          'Feito o desconto do exagero, sobra um conjunto de ferramentas concretas e bem descritas. O **metamodelo** é um repertório de perguntas que recupera a informação que a fala apagou, o que transforma "eu nunca consigo" numa frase examinável. A **ancoragem** usa associação para tornar um estado emocional acessível quando ele é necessário. A **modelagem** decompõe uma competência em passos observáveis, de modo que ela possa ser ensinada em vez de admirada.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Nada disso é mágico e nada disso é pouco. São ferramentas de comunicação e de mudança de comportamento, e funcionam na medida em que quem as usa sabe o que está fazendo. Isso não se resolve com apostila. Resolve-se com prática supervisionada.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Se quiser ver como esses conteúdos se organizam numa formação completa, a ementa do [PNL Practitioner](/pnl-practitioner) está publicada aula por aula, incluindo qual exercício prático corresponde a cada uma.',
      },
    ],
  },

  {
    slug: 'metamodelo-da-linguagem',
    titulo: 'Metamodelo: as três formas como a fala esconde o problema',
    tituloSeo: 'Metamodelo da linguagem na PNL: omissão, distorção e generalização',
    resumo:
      'Omissão, distorção e generalização são os três modos como a linguagem encolhe a experiência. O metamodelo é o conjunto de perguntas que recupera o que ficou de fora, e a razão de "eu nunca consigo" ser uma frase incompleta.',
    buscaAlvo: 'metamodelo PNL / omissão distorção generalização / perguntas do metamodelo',
    publicadoEm: '2026-09-07',
    revisadoEm: '2026-09-07',
    eixo: 'pnl',
    cursoRelacionado: '/pnl-practitioner',
    revisado: true,
    corpo: [
      {
        tipo: 'paragrafo',
        texto:
          'Ninguém diz tudo o que sabe. Entre a experiência completa de uma pessoa, a **estrutura profunda**, e a frase que ela pronuncia, a **estrutura superficial**, há uma perda enorme e inevitável. Falar exige encolher. O metamodelo é o mapa dessa perda: descreve por onde a informação some e oferece a pergunta que a traz de volta.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Não é uma técnica de persuasão. É o contrário: um método de escutar com precisão, feito de perguntas que devolvem à pessoa a parte da própria experiência que ela deixou de fora ao contar.',
      },
      { tipo: 'subtitulo', texto: '1. Omissão: o que ficou de fora' },
      {
        tipo: 'paragrafo',
        texto:
          'A frase está gramaticalmente completa, mas falta informação para que ela signifique alguma coisa verificável.',
      },
      {
        tipo: 'lista',
        itens: [
          '"Eu estou ansioso." → Ansioso **com o quê**? Em que situação, especificamente?',
          '"Ninguém me apoia." → **Quem**, exatamente, não te apoiou?',
          '"É melhor assim." → Melhor **do que o quê**? Melhor **para quem**?',
          '"Fui rejeitado." → Rejeitado **por quem**, e **como** você soube?',
        ],
      },
      {
        tipo: 'paragrafo',
        texto:
          'O ganho não é retórico. "Estou ansioso" é um estado permanente sobre o qual não há nada a fazer. "Fico ansioso quando preciso falar numa reunião com mais de seis pessoas" é um problema com contorno, e problema com contorno tem por onde ser trabalhado.',
      },
      { tipo: 'subtitulo', texto: '2. Distorção: o que foi reinterpretado' },
      {
        tipo: 'paragrafo',
        texto:
          'Aqui a informação não sumiu. Ela foi remontada numa relação que talvez não exista. Três formas aparecem o tempo todo.',
      },
      {
        tipo: 'lista',
        itens: [
          '**Leitura mental.** "Ele acha que eu sou incompetente." → Como você sabe o que ele acha?',
          '**Causa e efeito.** "Ela me irrita." → Como, exatamente, o que ela faz produz a sua irritação?',
          '**Nominalização.** "Falta comunicação no meu casamento." → "Comunicação" virou coisa. Quem precisa comunicar o quê, a quem, e quando isso deixou de acontecer?',
        ],
      },
      {
        tipo: 'paragrafo',
        texto:
          'A nominalização é a mais traiçoeira das três. Ela transforma um processo em substantivo, e um substantivo não tem o que ser mudado: "a comunicação" é um objeto parado. Devolver o verbo, comunicar, devolve junto quem age.',
      },
      { tipo: 'subtitulo', texto: '3. Generalização: o caso que virou regra' },
      {
        tipo: 'paragrafo',
        texto:
          'Uma experiência particular é promovida a lei. É o mecanismo que permite aprender com um caso, e o mesmo que aprisiona quem aprendeu a lição errada.',
      },
      {
        tipo: 'lista',
        itens: [
          '**Quantificador universal.** "Eu **nunca** consigo." → Nunca? Houve alguma vez em que conseguiu, mesmo que em parte?',
          '**Operador modal de necessidade.** "Eu **tenho que** aguentar." → O que aconteceria se você não aguentasse?',
          '**Operador modal de possibilidade.** "Eu **não posso** recusar." → O que impede?',
        ],
      },
      {
        tipo: 'paragrafo',
        texto:
          'A pergunta sobre o quantificador universal é a mais produtiva de todas, porque uma única exceção derruba a regra inteira. Quem responde "bom, uma vez eu consegui" acabou de fornecer o material com que a mudança será construída.',
      },
      { tipo: 'subtitulo', texto: 'A pergunta certa, no momento certo' },
      {
        tipo: 'paragrafo',
        texto:
          'Uma cliente se dizia invisível no trabalho. Reclamava que os colegas cortavam a fala dela e que o gerente sempre validava os outros. Passei um tempo tentando entender o contexto: como eram as reuniões, o tom de voz, a forma como ela apresentava os dados. Até que, em vez de mais uma pergunta analítica, joguei outra: "se você soubesse que não vai levar um não, o que você pediria agora?"',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Ela parou, respirou fundo e falou algo totalmente diferente do que vinha repetindo. Era um projeto pessoal que nem tinha coragem de mencionar. A pergunta a tirou do laço da reclamação e a colocou no lugar de potência. Dali em diante a conversa fluiu de verdade, porque ela se viu como protagonista e não como vítima do ambiente.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Repare no que fez a pergunta funcionar. Não foi a técnica: foi o tempo de escuta que veio antes dela. A mesma frase, dita nos primeiros cinco minutos, teria soado como deboche.',
      },
      { tipo: 'subtitulo', texto: 'E a vez em que eu perguntei demais' },
      {
        tipo: 'paragrafo',
        texto:
          'Um rapaz me procurou frustrado com a namorada, dizendo que ela vivia postando nas redes e ignorando ele. No meu afã de mapear tudo, comecei a enchê-lo de perguntas: o que ele sentia exatamente, o que ela dizia quando ele tocava no assunto, como tinha sido a infância dele com ciúmes, qual era o medo real por trás daquilo, o que ele esperava que ela fizesse.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Na terceira pergunta ele já respondia por monossílabos. Na quinta, cruzou os braços e disse: "pô, parece que eu tô no divã e você só quer caçar problema. Eu só queria desabafar". Ele se fechou por completo, e com razão. Eu estava tão concentrado em entender o mapa que esqueci de construir conexão e segurança primeiro.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'A diferença entre os dois atendimentos foi brutal, e não estava na técnica. Estava no que veio antes dela. Cada pergunta nova que eu fazia àquele rapaz dizia, sem que eu percebesse, que o que ele sentia não era suficiente, ou que eu duvidava dele. Quando você pergunta demais, a pessoa só quer se proteger, e o diagnóstico vira uma parede.',
      },
      {
        tipo: 'destaque',
        titulo: 'A parte que quase nunca é ensinada',
        texto:
          'O metamodelo é fácil de aprender e fácil de usar mal. Perguntado em sequência, sem sintonia, vira interrogatório. O mapa se desenha junto, não com uma metralhadora de perguntas. A regra prática: cada pergunta precisa ser sustentada por rapport suficiente para bancá-la, e a informação recuperada precisa ir a algum lugar. Perguntar por perguntar é violência com aparência de técnica.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'É por isso que a nossa formação não trata o metamodelo como uma lista para decorar. São cinco aulas, com prática correspondente para cada categoria, e os exercícios acontecem no simulador antes de qualquer atendimento real. A [ementa completa do Practitioner](/pnl-practitioner) mostra como isso se distribui.',
      },
    ],
  },

  {
    slug: 'hipnose-clinica-o-que-e-o-transe',
    titulo: 'Hipnose clínica: o que o transe é, e o que ele não é',
    tituloSeo: 'Hipnose clínica: o que é o transe, como funciona e quando não usar',
    resumo:
      'Transe não é sono, não é perda de controle e não é palco. É um estado de atenção concentrada com o senso crítico afrouxado, e saber quando não induzi-lo importa mais do que saber induzi-lo.',
    buscaAlvo: 'o que é hipnose clínica / hipnose funciona / o que se sente na hipnose',
    publicadoEm: '2026-09-07',
    revisadoEm: '2026-09-07',
    eixo: 'hipnoterapia',
    cursoRelacionado: '/hipnoterapia',
    revisado: true,
    corpo: [
      {
        tipo: 'paragrafo',
        texto:
          'A maior parte do que as pessoas sabem sobre hipnose veio de palco e de televisão, e quase tudo está errado. Quem chega a uma primeira sessão costuma trazer três medos: dormir, perder o controle e revelar algo que não queria. Nenhum dos três descreve o que acontece.',
      },
      { tipo: 'subtitulo', texto: 'O que o transe é' },
      {
        tipo: 'paragrafo',
        texto:
          'Transe é um estado de **atenção concentrada** em que o filtro que costuma avaliar e recusar cada informação nova, o fator crítico, fica temporariamente afrouxado. A pessoa continua acordada, continua ouvindo, continua sabendo onde está. O que muda é a proporção: menos vigilância analítica, mais absorção.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'É um estado comum. Dirigir um trecho conhecido e chegar sem lembrar do caminho é transe. Perder a noção do tempo dentro de um livro é transe. O que a hipnose clínica faz não é criar um estado exótico: é induzir de propósito, aprofundar de modo controlado e usar para um objetivo combinado algo que acontece sozinho o tempo todo.',
      },
      { tipo: 'subtitulo', texto: 'O que ele não é' },
      {
        tipo: 'lista',
        itens: [
          '**Não é sono.** Registros de atividade cerebral em transe não se parecem com os do sono. A pessoa está desperta e responde.',
          '**Não é perda de vontade.** Ninguém faz sob hipnose o que recusaria fora dela. Sugestão que colide com os valores da pessoa é simplesmente rejeitada, e a rejeição costuma encerrar o transe.',
          '**Não é inconsciência.** A esmagadora maioria lembra da sessão inteira. Quem esperava apagar sai achando que "não funcionou", quando funcionou.',
          '**Não é máquina de verdade.** O ponto seguinte é o mais importante deste texto.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Memória sob hipnose: o risco que quase ninguém menciona' },
      {
        tipo: 'paragrafo',
        texto:
          'A memória humana não é gravação. É reconstrução, e cada lembrança é remontada no momento em que é evocada. Sob transe, com o senso crítico afrouxado e a sugestionabilidade aumentada, essa reconstrução fica **mais** vulnerável à influência de quem conduz, não menos.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'A consequência é séria e bem documentada: uma pergunta mal formulada pode produzir uma lembrança vívida, detalhada, emocionalmente convincente e falsa. Pior, o processo tende a aumentar a confiança da pessoa naquilo que "lembrou". É por isso que material obtido sob hipnose tem valor probatório restrito ou nulo em vários sistemas jurídicos.',
      },
      {
        tipo: 'destaque',
        titulo: 'Como isso aparece na nossa formação',
        texto:
          'Falsas memórias não são uma nota de rodapé no módulo de regressão. São uma aula inteira, dedicada a identificá-las e preveni-las, seguida de uma aula de ética crítica sobre regressão e trauma com aprovação obrigatória. Não se avança na formação sem passar por ela. É a diferença entre ensinar uma técnica e ensinar a responsabilidade que vem com ela.',
      },
      { tipo: 'subtitulo', texto: 'Quando NÃO usar hipnose' },
      {
        tipo: 'paragrafo',
        texto:
          'Essa é a pergunta que separa o profissional do entusiasta, e é o único conteúdo desta página que pedimos que você leve daqui mesmo que nunca faça formação nenhuma.',
      },
      {
        tipo: 'lista',
        itens: [
          'Quadros psicóticos, em surto ou com histórico. A indução pode agravar.',
          'Quando há indicação clínica ou psiquiátrica ativa: a hipnoterapia não substitui tratamento, e conduzir como se substituísse é dano.',
          'Quando a demanda é jurídica ou investigativa. Recuperar memória "para provar" algo é justamente onde o risco de falsa memória se realiza.',
          'Quando não há consentimento informado e específico sobre o que será feito.',
          'Quando o caso está claramente fora da sua competência. Encaminhar é decisão técnica, não fracasso.',
        ],
      },
      {
        tipo: 'paragrafo',
        texto:
          'A hipnoterapia é uma abordagem educacional e de desenvolvimento pessoal. Não substitui tratamento médico ou psiquiátrico, e a legislação sobre atendimento terapêutico varia conforme o estado e o conselho profissional envolvido. Verifique a sua situação antes de atender.',
      },
      { tipo: 'subtitulo', texto: 'A vez em que o melhor atendimento foi não atender' },
      {
        tipo: 'paragrafo',
        texto:
          'Uma mulher me procurou dizendo que queria hipnose para "apagar" um término de relacionamento que estava destruindo ela. Chegou falando rápido, com os olhos marejados, repetindo que não aguentava mais sentir dor e que precisava de um "reset" urgente, porque estava faltando ao trabalho e perdendo peso sem querer. Na superfície, um luto amoroso clássico.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Quando pedi que descrevesse o dia a dia, ela mencionou de passagem que tinha crises de taquicardia e que já havia desmaiado duas vezes no último mês. Ali eu parei e respirei fundo. O que ela estava descrevendo não era só tristeza: eram sintomas físicos que escapam completamente do que a hipnose pode oferecer com segurança.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Precisei ser direto, mas com cuidado. Falei que a hipnose podia ajudar com a angústia, sim, mas que aqueles sintomas pediam uma avaliação médica primeiro, porque eu não tenho formação para descartar algo cardiológico ou hormonal. Ela ficou em silêncio por alguns segundos, com cara de desapontamento, e eu vi que tinha interpretado aquilo como rejeição.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Expliquei que não era um não definitivo, era um "vamos por partes", e que eu podia acompanhar depois se o laudo viesse limpo. Minha prioridade era não transformar uma ferramenta poderosa num paliativo perigoso. Indiquei uma cardiologista que eu conhecia e que tem um jeito acolhedor, e escrevi num papel o contato dela e o que ela deveria falar na consulta.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Ela agradeceu meio sem jeito. Soube que tinha acertado duas semanas depois, quando ela me mandou mensagem contando que a médica encontrou uma arritmia leve e que já estava em tratamento. Escreveu que, se tivesse feito hipnose naquele estado, provavelmente teria mascarado o problema e piorado tudo.',
      },
      {
        tipo: 'destaque',
        titulo: 'O que esse caso ensina',
        texto:
          'Não é sobre atender todo mundo. É sobre saber quando o melhor atendimento é não atender. Esse tipo de história não vende curso nem gera curtida, e é por isso que quase ninguém a publica. Mas é exatamente aí que a ética deixa de ser discurso e vira atitude, e é isso que se ensina numa formação séria: não a técnica de induzir, mas o julgamento de quando não induzir.',
      },
      {
        tipo: 'paragrafo',
        texto:
          'Se quiser ver como esse cuidado se traduz em ementa, os quatro blocos de ética obrigatória da [formação em Hipnoterapia Clínica](/hipnoterapia) estão publicados, com o conteúdo de cada um.',
      },
    ],
  },
];

/** Só o que o Bruno já revisou vai ao ar. Ver o aviso no topo do arquivo. */
export const artigosPublicados = artigos.filter((a) => a.revisado);

/** Encontra um artigo pelo slug da URL. */
export function artigoPorSlug(slug?: string): Artigo | undefined {
  return artigos.find((a) => a.slug === slug);
}
