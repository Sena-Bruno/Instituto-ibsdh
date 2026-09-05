/**
 * Ementas oficiais das formações, como dados.
 *
 * Antes: o currículo do PNL Practitioner eram 741 linhas de <tr> escritas à
 * mão dentro do JSX da página, e Hipnoterapia e Master PNL guardavam arrays
 * embutidos no meio da marcação, cada um com um formato de coluna diferente.
 * Corrigir uma aula era mexer em marcação, e foi por aí que os três formatos
 * divergiram. Aqui o currículo é dado, e a tabela é uma só.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  DUAS EMENTAS INCOMPLETAS — PARA O BRUNO RESOLVER                  │
 * │                                                                       │
 * │  Ao transformar a marcação em dados ficou visível que duas páginas    │
 * │  anunciavam mais aulas do que publicavam:                             │
 * │                                                                       │
 * │  MASTER PNL — anunciava "7 Módulos. 48 Aulas". A ementa publicada     │
 * │  tem 31, numeradas de 1 a 31, sem intervalos e sem faixas agrupadas.  │
 * │  Faltam 17 aulas, ou o número 48 está errado.                         │
 * │                                                                       │
 * │  HIPNOTERAPIA — anuncia "100 horas. 44 aulas". Somando as faixas      │
 * │  (o "16-22" vale 7 aulas, não 1) chega-se a 40: o módulo 6,           │
 * │  "Auto-hipnose e ensino", tem descrição mas nenhuma aula listada.     │
 * │  São as 4 que faltam — provavelmente as de número 35 a 38.            │
 * │                                                                       │
 * │  O PNL Practitioner fecha certo: 44 aulas, 100h, 7 módulos.           │
 * │                                                                       │
 * │  As páginas agora derivam a contagem destes dados, então não têm      │
 * │  como se contradizer. Mas isso significa que elas anunciam o número   │
 * │  menor até você completar a ementa — preferi publicar a menos do que  │
 * │  prometer aula que a página não mostra.                               │
 * └───────────────────────────────────────────────────────────────────────┘
 */

interface Aula {
  /** Número da aula, ou faixa como "16-22" quando várias são agrupadas */
  id: string;
  titulo: string;
  /** O que a aula cobre. Nem toda ementa registra este campo. */
  conteudo?: string;
  /** O exercício correspondente no SENA */
  pratica?: string;
  /** Aula do bloco de ética e limites: destacada na tabela */
  etica?: boolean;
  /** Avaliação obrigatória ou marco da formação */
  destaque?: boolean;
}

export interface ModuloCurriculo {
  numero: string;
  titulo: string;
  /** Carga horária do módulo. O Master PNL não a registra por módulo. */
  carga?: string;
  /** Descrição curta exibida sob o título do módulo */
  resumo?: string;
  aulas: Aula[];
}

/**
 * Conta as aulas de uma ementa respeitando as faixas: "16-22" vale 7 aulas,
 * não 1. Sem isso a Hipnoterapia apareceria com 24 aulas em vez de 44.
 */
export function contarAulas(modulos: ModuloCurriculo[]): number {
  return modulos.reduce(
    (total, modulo) =>
      total +
      modulo.aulas.reduce((soma, aula) => {
        const faixa = aula.id.match(/^(\d+)\s*-\s*(\d+)$/);
        return soma + (faixa ? Number(faixa[2]) - Number(faixa[1]) + 1 : 1);
      }, 0),
    0,
  );
}

/** Soma a carga horária declarada por módulo. Zero quando não há registro. */
export function somarCarga(modulos: ModuloCurriculo[]): number {
  return modulos.reduce(
    (total, modulo) => total + (Number.parseInt(modulo.carga ?? '', 10) || 0),
    0,
  );
}

export const curriculoPnlPractitioner: ModuloCurriculo[] = [
  {
    numero: 'M1',
    titulo: 'Origens e fundamentos',
    carga: '14h',
    aulas: [
      {
        id: '1',
        titulo: 'A História da PNL',
        conteudo: 'Bandler, Grinder, Satir, Perls e Erickson. Nascimento da modelagem',
        pratica: 'Quiz de fixação metodológica',
      },
      {
        id: '2',
        titulo: 'Modelagem: O Coração da PNL',
        conteudo: 'Diferença entre imitar e modelar excelência',
        pratica: 'Identificação de padrões em vídeos',
      },
      {
        id: '3',
        titulo: 'Mente Consciente vs. Inconsciente',
        conteudo: 'Capacidades, limites, neuroplasticidade',
        pratica: 'Simulação de explicações diferentes',
      },
      {
        id: '4',
        titulo: 'O Fator Crítico',
        conteudo: '"Porteiro" da mente, mecanismos de resistência',
        pratica: 'Simulação de resistência do paciente',
      },
      {
        id: '5',
        titulo: 'Omissão, Distorção, Generalização',
        conteudo: '3 filtros da percepção humana',
        pratica: 'Identificação em pensamentos próprios',
      },
      {
        id: '6',
        titulo: 'O Mapa Não é o Território',
        conteudo: 'Distinção clínica: realidade vs. percepção',
        pratica: 'Aplicação de pressupostos em situações',
      },
      {
        id: '7',
        titulo: 'Os 13 Pressupostos da PNL',
        conteudo: 'Crenças operacionais da excelência (5 essenciais)',
        pratica: 'Quiz + aplicação prática',
      },
    ],
  },
  {
    numero: 'M2',
    titulo: 'Sistemas representacionais e acuidade',
    carga: '14h',
    aulas: [
      {
        id: '8',
        titulo: 'VAKOG: Os 5 Canais',
        conteudo: 'Visual, Auditivo, Cinestésico, Olfativo, Gustativo',
        pratica: 'Teste de perfil representacional próprio',
      },
      {
        id: '9',
        titulo: 'Pistas de Acesso Ocular',
        conteudo: 'Mapa neurológico dos movimentos oculares de Bandler',
        pratica: 'Análise de vídeos com feedback',
      },
      {
        id: '10',
        titulo: 'Predicados e Linguagem',
        conteudo: 'Palavras que revelam sistemas preferidos',
        pratica: 'Caça a predicados em textos complexos',
      },
      {
        id: '11',
        titulo: 'Rapport Básico',
        conteudo: 'Espelhamento físico e acompanhamento fisiológico',
        pratica: 'Avaliação de espelhamento (vídeo)',
      },
      {
        id: '12',
        titulo: 'Rapport Avançado',
        conteudo: 'Micro-sincronias, espelhamento cruzado, ritmo respiratório',
        pratica: 'Simulação com 3 perfis (V, A, C)',
      },
    ],
  },
  {
    numero: 'M3',
    titulo: 'A estrutura da linguagem',
    carga: '14h',
    aulas: [
      {
        id: '13',
        titulo: 'Estrutura Superficial vs. Profunda',
        conteudo: 'O que foi dito vs. o que foi subconscientemente vivido',
        pratica: 'Análise clínica de frases',
      },
      {
        id: '14',
        titulo: 'Metamodelo (Parte 1: Omissões)',
        conteudo: 'Nominalizações, verbos não especificados, comparativos',
        pratica: 'Desmonte de frases ambíguas',
      },
      {
        id: '15',
        titulo: 'Metamodelo (Parte 2: Distorções)',
        conteudo: 'Leitura de mente, equivalência complexa, causa-efeito',
        pratica: 'Desmonte de crenças simuladas',
      },
      {
        id: '16',
        titulo: 'Metamodelo (Parte 3: Generalizações)',
        conteudo: 'Universalizações, modalidades operacionais',
        pratica: 'Diálogo imersivo de 30 min',
      },
      {
        id: '17',
        titulo: 'Integração do Metamodelo',
        conteudo: 'Fluência conversacional sem parecer interrogatório',
        pratica: 'Feedback instantâneo do SENA',
      },
    ],
  },
  {
    numero: 'M4',
    titulo: 'Engenharia emocional',
    carga: '14h',
    aulas: [
      {
        id: '18',
        titulo: 'B.V.O. (Bem-Formulado)',
        conteudo: 'Sintaxe de metas que a neurologia aceita executar',
        pratica: 'Formulação de meta pessoal validada',
      },
      {
        id: '19',
        titulo: 'Fisiologia e Estado',
        conteudo: 'Postura do corpo cria e mantém emoções bioquímicas',
        pratica: 'Auto-regulação guiada',
      },
      {
        id: '20',
        titulo: 'Ancoragem Clássica',
        conteudo: 'Estímulo-resposta, gatilhos físicos de alto recurso',
        pratica: 'Auto-ancoragem guiada passo a passo',
      },
      {
        id: '21',
        titulo: 'Colapso de Âncoras',
        conteudo: 'Destruição de gatilhos emocionais negativos',
        pratica: 'Resolução teórica de âncora negativa',
      },
      {
        id: '22',
        titulo: 'Empilhamento e Cadeias',
        conteudo: 'Soma progressiva de recursos para estados de pico',
        pratica: 'Criação de cadeia pessoal',
      },
      {
        id: '23',
        titulo: 'Círculo de Excelência',
        conteudo: 'Campo espacial de alto desempenho',
        pratica: 'Prática gravada com feedback',
      },
      {
        id: '24',
        titulo: 'Posições Perceptivas',
        conteudo: '1ª, 2ª, 3ª posição para resolução de conflitos',
        pratica: 'Mudança de posição guiada',
      },
    ],
  },
  {
    numero: 'M5',
    titulo: 'Submodalidades — o código interno',
    carga: '16h',
    aulas: [
      {
        id: '25',
        titulo: 'O Que São Submodalidades',
        conteudo: 'Qualidades sensoriais internas (brilho, volume, temperatura)',
        pratica: 'Mapeamento de memórias',
      },
      {
        id: '26',
        titulo: 'Descoberta e Mapeamento',
        conteudo: 'Como o cérebro codifica prazer vs. dor',
        pratica: 'Exercício de análise',
      },
      {
        id: '27',
        titulo: 'Análise Contrastiva',
        conteudo: 'Estrutura neurológica de duas experiências distintas',
        pratica: 'Análise contrastiva guiada',
      },
      {
        id: '28',
        titulo: 'Pattern Interrupt',
        conteudo: 'Quebra e interrupção de padrões mentais automáticos',
        pratica: 'Interrupção de padrão de ansiedade',
      },
      {
        id: '29',
        titulo: 'Swish Pattern VISUAL',
        conteudo: 'Substituição imediata de imagens para mudança de hábitos',
        pratica: 'Prática validada',
      },
      {
        id: '30',
        titulo: 'Swish Pattern AUDITIVO',
        conteudo: 'Adaptação para processamento sonoro',
        pratica: 'Prática validada',
      },
      {
        id: '31',
        titulo: 'Swish Pattern CINESTÉSICO',
        conteudo: 'Adaptação para processamento corporal/emocional',
        pratica: 'Prática validada',
      },
      {
        id: '32',
        titulo: 'Ponte ao Futuro',
        conteudo: 'Teste ecológico e instalação de mudanças na linha do tempo',
        pratica: 'Visualização + teste',
      },
    ],
  },
  {
    numero: 'M6',
    titulo: 'Protocolos terapêuticos',
    carga: '16h',
    aulas: [
      {
        id: '33',
        titulo: 'Níveis Neurológicos (Dilts)',
        conteudo:
          'Alinhamento de Ambiente, Comportamento, Capacidade, Crença, Identidade, Missão',
        pratica: 'Intervenção em desalinhamento',
      },
      {
        id: '34',
        titulo: 'Cura Rápida de Fobias',
        conteudo: 'Protocolo de dissociação dupla (Visual-Cinestésico)',
        pratica: 'Simulação (3 níveis de dificuldade)',
      },
      {
        id: '35',
        titulo: 'Segurança em Técnicas Fortes',
        conteudo: 'Contraindicações, limites éticos, momento de encaminhar',
        pratica: 'Quiz obrigatório 100%',
      },
      {
        id: '36',
        titulo: 'Integração de Partes',
        conteudo: 'Resolução de autossabotagem e conflitos internos severos',
        pratica: 'Simulação de parte conflitante',
      },
      {
        id: '37',
        titulo: 'Estratégia de Criatividade Disney',
        conteudo: 'Fluxo Sonhador-Realista-Crítico',
        pratica: 'Aplicação em projeto pessoal',
      },
      {
        id: '38',
        titulo: 'Combinação de Técnicas',
        conteudo: 'Decisão clínica: qual ferramenta usar',
        pratica: 'Estudo de casos com SENA',
      },
    ],
  },
  {
    numero: 'M7',
    titulo: 'Do aluno ao profissional de elite',
    carga: '12h',
    aulas: [
      {
        id: '39',
        titulo: 'Estrutura de Sessão Completa',
        conteudo: 'Abertura, investigação (anamnese), intervenção, fechamento',
        pratica: 'Script completo fornecido',
      },
      {
        id: '40',
        titulo: 'Anamnese com PNL',
        conteudo: 'Histórico clínico usando Metamodelo e Calibração',
        pratica: 'Simulação com 3 históricos médicos',
      },
      {
        id: '41',
        titulo: 'Ética e Posicionamento',
        conteudo: 'O que a PNL é e o que não é à luz do mercado',
        pratica: 'Casos-teste de ética profissional',
      },
      {
        id: '42',
        titulo: 'Do Gratuito ao Pago',
        conteudo: 'Primeiras provas sociais, precificação inicial, contratos',
        pratica: 'Cálculo de precificação base',
      },
      {
        id: '43',
        titulo: 'Atendimento Online',
        conteudo: 'Adaptações de segurança para PNL via vídeo',
        pratica: 'Checklist técnico',
      },
      {
        id: '44',
        titulo: 'O Exame de Competência',
        conteudo: 'Avaliação final da capacidade técnica do Reprogramador',
        pratica: 'Avaliação SENA (nota mínima 7/10)',
      },
    ],
  },
];

export const curriculoHipnoterapia: ModuloCurriculo[] = [
  {
    numero: 'M1',
    titulo: 'Fundamentos do transe',
    carga: '14h',
    aulas: [
      {
        id: '1-6',
        titulo: 'História, neurociência, mecanismos, mitos, estados de consciência',
        pratica: 'Quiz, discussão, identificação de mitos',
      },
      {
        id: '7',
        titulo: 'ÉTICA OBRIGATÓRIA — Limites legais e profissionais',
        pratica: 'Quiz 100% para liberar Módulo 2',
        etica: true,
      },
    ],
  },
  {
    numero: 'M2',
    titulo: 'Induções e profundização',
    carga: '16h',
    aulas: [
      {
        id: '8',
        titulo: 'Preparo do cliente e ambiente',
        pratica: 'Simulação: cliente ansioso',
      },
      {
        id: '9',
        titulo: 'Indução Elman (fixação visual)',
        pratica: 'Indução em SENA + feedback de sinais',
        destaque: true,
      },
      { id: '10', titulo: 'Indução progressiva', pratica: 'Indução completa' },
      { id: '11', titulo: 'Induções rápidas', pratica: 'Simulação: quando usar' },
      { id: '12', titulo: 'Testes de profundidade', pratica: 'SENA em transe → você testa' },
      { id: '13', titulo: 'Deepeners', pratica: 'Aprofundar transe induzido' },
      { id: '14', titulo: 'Emergência segura', pratica: 'SENA como paciente → você emerge' },
      {
        id: '15',
        titulo: 'Prática integrada',
        pratica: 'Avaliação obrigatória: nota mínima 7/10',
        destaque: true,
      },
    ],
  },
  {
    numero: 'M3',
    titulo: 'Protocolos terapêuticos',
    carga: '18h',
    resumo: 'Ansiedade, fobias, hábitos, dor, insônia, performance, procedimentos médicos',
    aulas: [
      { id: '16-22', titulo: '7 protocolos específicos', pratica: 'Simulação de cada caso' },
      {
        id: '23',
        titulo: 'ÉTICA OBRIGATÓRIA — Quando NÃO usar hipnose',
        pratica: 'Quiz 100% + casos-teste',
        etica: true,
      },
    ],
  },
  {
    numero: 'M4',
    titulo: 'Regressão e memória',
    carga: '14h',
    aulas: [
      {
        id: '24-26',
        titulo: 'Teoria, técnica, reprocessamento',
        pratica: 'Regressão simulada',
      },
      {
        id: '27',
        titulo: 'Falsas memórias: identificação e prevenção',
        pratica: 'Caso de risco',
      },
      {
        id: '28',
        titulo: 'ÉTICA CRÍTICA — Regressão e trauma',
        pratica: 'Casos-teste: faço ou encaminho?',
        etica: true,
      },
      { id: '29', titulo: 'Integração pós-regressão', pratica: 'SENA pós-regressão' },
    ],
  },
  {
    numero: 'M5',
    titulo: 'Hipnose conversacional',
    carga: '14h',
    aulas: [
      {
        id: '30-33',
        titulo: 'Sugestão indireta, padrões Erickson, metáforas, aplicações',
        pratica: 'Criação e feedback',
      },
      {
        id: '34',
        titulo: 'ÉTICA — Influência e consentimento',
        pratica: 'Debate guiado',
        etica: true,
      },
    ],
  },
  {
    numero: 'M6',
    titulo: 'Auto-hipnose e ensino',
    carga: '12h',
    resumo: 'Auto-hipnose básica e avançada, grupos, gravações terapêuticas',
    aulas: [],
  },
  {
    numero: 'M7',
    titulo: 'Profissionalização',
    carga: '12h',
    aulas: [
      { id: '39', titulo: 'Sessão completa', pratica: 'Nota parcial' },
      { id: '40', titulo: 'Anamnese hipnótica', pratica: '3 históricos simulados' },
      {
        id: '41',
        titulo: 'Documentação e proteção legal',
        pratica: 'Preenchimento para caso SENA',
      },
      { id: '42', titulo: 'Precificação e posicionamento', pratica: 'Questionamento do SENA' },
      { id: '43', titulo: 'Atendimento online', pratica: 'Indução via simulação de vídeo' },
      {
        id: '44',
        titulo: 'Exame final',
        pratica: 'SENA como cliente complexo → nota mínima 7/10',
        destaque: true,
      },
    ],
  },
];

export const curriculoMasterPnl: ModuloCurriculo[] = [
  {
    numero: 'M1',
    titulo: 'Modelagem comportamental avançada',
    aulas: [
      { id: '1', titulo: 'A Essência da Modelagem', pratica: 'Análise de vídeo de expert' },
      {
        id: '2',
        titulo: 'Extração de Estratégias (TOTE)',
        pratica: 'Simulação de entrevista de modelagem',
      },
      { id: '3', titulo: 'Instalação de Estratégias', pratica: 'Auto-instalação guiada' },
      {
        id: '4',
        titulo: 'Modelagem de Crenças',
        pratica: 'Identificação de crenças de suporte',
      },
      { id: '5', titulo: 'Projeto de Modelagem', pratica: 'Apresentação de caso ao SENA' },
    ],
  },
  {
    numero: 'M2',
    titulo: 'Metaprogramas e filtros inconscientes',
    aulas: [
      { id: '6', titulo: 'O que são Metaprogramas', pratica: 'Quiz de identificação' },
      {
        id: '7',
        titulo: 'Direção (Aproximação vs. Afastamento)',
        pratica: 'Ajuste de copy/discurso',
      },
      { id: '8', titulo: 'Referência (Interna vs. Externa)', pratica: 'Simulação de feedback' },
      {
        id: '9',
        titulo: 'Tamanho do Chunk (Global vs. Específico)',
        pratica: 'Tradução de comunicação',
      },
      { id: '10', titulo: 'Perfilamento Rápido', pratica: 'Análise de 5 perfis complexos' },
    ],
  },
  {
    numero: 'M3',
    titulo: 'Valores e critérios',
    aulas: [
      { id: '11', titulo: 'Hierarquia de Valores', pratica: 'Eliciação de valores próprios' },
      { id: '12', titulo: 'Conflitos de Valores', pratica: 'Resolução de conflito simulado' },
      { id: '13', titulo: 'Mudança de Valores', pratica: 'Intervenção ecológica' },
      {
        id: '14',
        titulo: 'Alinhamento de Níveis Neurológicos',
        pratica: 'Prática de alinhamento completo',
      },
    ],
  },
  {
    numero: 'M4',
    titulo: 'Sleight of Mouth (ressignificação avançada)',
    aulas: [
      { id: '15', titulo: 'A Estrutura da Crença', pratica: 'Desconstrução lógica' },
      {
        id: '16',
        titulo: 'Padrões de Intenção e Redefinição',
        pratica: 'Batalha de objeções com SENA',
      },
      {
        id: '17',
        titulo: 'Padrões de Consequência e Chunking',
        pratica: 'Batalha de objeções com SENA',
      },
      {
        id: '18',
        titulo: 'Padrões de Metáfora e Modelo de Mundo',
        pratica: 'Batalha de objeções com SENA',
      },
      {
        id: '19',
        titulo: 'Fluência em Sleight of Mouth',
        pratica: 'Simulação de venda/negociação',
      },
    ],
  },
  {
    numero: 'M5',
    titulo: 'Linguagem hipnótica (Modelo Milton)',
    aulas: [
      { id: '20', titulo: 'Transe e PNL', pratica: 'Identificação de estados de transe' },
      {
        id: '21',
        titulo: 'Padrões de Linguagem Indireta',
        pratica: 'Criação de roteiro hipnótico',
      },
      {
        id: '22',
        titulo: 'Comandos Ocultos e Marcação Analógica',
        pratica: 'Análise de discurso',
      },
      { id: '23', titulo: 'Metáforas Isomórficas', pratica: 'Criação de metáfora terapêutica' },
    ],
  },
  {
    numero: 'M6',
    titulo: 'Intervenções avançadas',
    aulas: [
      { id: '24', titulo: 'Reenquadramento em 6 Passos', pratica: 'Simulação de caso clínico' },
      { id: '25', titulo: 'Cura Rápida de Fobia', pratica: 'Simulação de caso clínico' },
      { id: '26', titulo: 'Swish Avançado', pratica: 'Simulação de caso clínico' },
      { id: '27', titulo: 'Terapia da Linha do Tempo', pratica: 'Simulação de caso clínico' },
      { id: '28', titulo: 'Integração de Partes', pratica: 'Simulação de caso clínico' },
    ],
  },
  {
    numero: 'M7',
    titulo: 'Excelência e certificação',
    aulas: [
      { id: '29', titulo: 'Design de Intervenção', pratica: 'Criação de protocolo exclusivo' },
      { id: '30', titulo: 'Ecologia Profunda', pratica: 'Análise de impactos sistêmicos' },
      { id: '31', titulo: 'O Exame Master', pratica: 'Avaliação SENA (nota mínima 8/10)' },
    ],
  },
];
