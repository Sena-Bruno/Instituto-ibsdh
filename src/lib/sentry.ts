/**
 * Monitoramento de erros em produção.
 *
 * Antes disto, um erro em produção só chegava ao instituto se algum
 * visitante avisasse — e a maioria simplesmente vai embora.
 *
 * Três decisões moldam este arquivo:
 *
 * 1. **Carrega só quando há erro.** O SDK do Sentry pesa cerca de 490 kB
 *    (160 kB comprimido), e isso não muda com tree-shaking. Baixá-lo em
 *    toda visita para, na esmagadora maioria delas, não reportar nada, é
 *    cobrar do visitante um custo que não se paga — ainda mais num público
 *    majoritariamente móvel. Os ouvintes de erro são registrados de
 *    imediato (custam alguns bytes) e o SDK só é buscado quando o primeiro
 *    erro realmente acontece.
 *
 * 2. **Nada se perde nesse meio-tempo.** Os erros que chegam antes de o
 *    SDK ficar pronto vão para uma fila e são repassados assim que ele
 *    carrega.
 *
 * 3. **Sem DSN, custo zero.** O Vite substitui `import.meta.env` em tempo
 *    de build; sem a variável definida, o Rollup elimina o import dinâmico
 *    e o SDK não entra no pacote de forma nenhuma. O desenvolvimento local
 *    fica silencioso e o build não quebra para quem clonar sem a chave.
 *
 * Para ativar, defina em Netlify → Site settings → Environment variables:
 *   VITE_SENTRY_DSN  o DSN do projeto no Sentry
 */

type SentryModule = typeof import('@sentry/react');

let sentry: SentryModule | null = null;
let carregando: Promise<SentryModule | null> | null = null;
let dsn: string | undefined;

/** Erros ocorridos antes de o SDK ficar pronto. Limitado para que um laço
 *  com erro não vire vazamento de memória. */
const fila: Array<{ error: unknown; extra?: Record<string, unknown> }> = [];

/** Ruído que não é defeito do site: extensão de navegador, queda de rede
 *  do visitante, script de terceiro. Chegam sem detalhe útil e afogariam
 *  os erros reais — e, como o SDK só carrega quando há erro, filtrar antes
 *  evita baixar 490 kB por causa de uma extensão do visitante. */
const RUIDO = [
  /extension:\/\//i,
  /^Script error\.?$/i,
  /NetworkError|Failed to fetch|Load failed/i,
  /ResizeObserver loop/i,
];

function ehRuido(error: unknown): boolean {
  const msg = typeof error === 'string' ? error : ((error as Error)?.message ?? '');
  return RUIDO.some((re) => re.test(msg));
}

function garantirSentry(): Promise<SentryModule | null> {
  // Comparação contra a constante literal, e não contra a variável `dsn`:
  // o Vite substitui `import.meta.env` em tempo de build, então sem a
  // variável definida esta função vira `return null` e o Rollup remove o
  // import dinâmico junto com o SDK inteiro. Guardar o valor numa
  // variável antes desconstrói essa eliminação.
  if (!import.meta.env.VITE_SENTRY_DSN) return Promise.resolve(null);

  if (!carregando) {
    carregando = import('@sentry/react')
      .then((mod) => {
        mod.init({
          dsn,
          environment: import.meta.env.MODE,

          // O site coleta nome e e-mail na lista de espera e autentica
          // com Google. Nada disso pode ir para um serviço externo sem
          // base legal: com isto desligado, IP, cookies e dados do usuário
          // não acompanham o erro.
          sendDefaultPii: false,

          // Só erros. O rastreamento de desempenho entregaria um dado que
          // o Search Console já dá de graça (Core Web Vitals) e que num
          // site de marketing ninguém aciona.
          integrations: [],

          beforeSend: (event, hint) => (ehRuido(hint?.originalException) ? null : event),
        });
        sentry = mod;
        return mod;
      })
      // Falhar ao carregar o monitoramento não pode derrubar o site.
      .catch(() => null);
  }
  return carregando;
}

/** Registra um erro, carregando o SDK sob demanda. */
export function captureException(error: unknown, extra?: Record<string, unknown>) {
  if (!dsn || ehRuido(error)) return;

  if (sentry) {
    sentry.captureException(error, extra ? { extra } : undefined);
    return;
  }

  if (fila.length < 20) fila.push({ error, extra });

  void garantirSentry().then((mod) => {
    if (!mod) return;
    for (const item of fila.splice(0)) {
      mod.captureException(item.error, item.extra ? { extra: item.extra } : undefined);
    }
  });
}

export function initSentry() {
  dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  window.addEventListener('error', (e) => captureException(e.error ?? e.message));
  window.addEventListener('unhandledrejection', (e) => captureException(e.reason));
}
