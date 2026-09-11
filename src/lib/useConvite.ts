import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Decide QUANDO o convite de material aparece, e se ele deve aparecer.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ⚠  O GATILHO É A PARTE QUE PROTEGE O SITE. NÃO TROQUE POR "AO ABRIR" │
 * │                                                                       │
 * │  Desde janeiro de 2017 o Google rebaixa página cujo conteúdo principal │
 * │  é coberto por um interstício quando a pessoa chega DA BUSCA. É a      │
 * │  regra dos "intrusive interstitials", e ela mira exatamente o pop-up   │
 * │  que abre sozinho assim que a página carrega no celular.               │
 * │                                                                       │
 * │  O site inteiro depende dessa porta: os sete artigos existem para      │
 * │  trazer gente da busca orgânica. Um convite disparado na entrada       │
 * │  cobraria em posição justamente as páginas que foram feitas para       │
 * │  ranquear, e a conta chegaria semanas depois, sem nada na tela         │
 * │  ligando uma coisa à outra.                                           │
 * │                                                                       │
 * │  Por isso o convite nunca abre na chegada. Ele espera um sinal de que  │
 * │  a pessoa JÁ ESTÁ ENGAJADA:                                           │
 * │                                                                       │
 * │   · rolou metade da página, ou                                        │
 * │   · passou 40 segundos nela, ou                                       │
 * │   · no desktop, levou o cursor para fora pelo topo (intenção de sair). │
 * │                                                                       │
 * │  O efeito colateral é bom: o robô do Google não rola, não espera e     │
 * │  não tem cursor, então ele nunca vê o convite. Para o rastreador, a    │
 * │  página continua sendo só a página.                                    │
 * └───────────────────────────────────────────────────────────────────────┘
 */

/** Onde fica a memória de quem já dispensou ou já deixou o contato. */
const CHAVE = 'ibsdh:convite';

/** Dias de silêncio depois de um "fechar". */
const ESPERA_APOS_DISPENSA = 30;

/** Metade da página rolada conta como leitura, não como passagem. */
const FRACAO_DE_ROLAGEM = 0.5;

/** Tempo na página que também conta como interesse, para quem não rola. */
const SEGUNDOS_NA_PAGINA = 40;

interface Memoria {
  /** Timestamp do último "fechar". */
  dispensadoEm?: number;
  /** `true` depois de deixar o contato. Vale para sempre. */
  convertido?: boolean;
}

/*
  `localStorage` lança exceção, e não devolve null, quando o navegador
  bloqueia armazenamento de site. Sem o try, um convite quebraria a página
  inteira no modo restrito do Safari e em algumas extensões de privacidade.
*/
function lerMemoria(): Memoria {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? '{}') as Memoria;
  } catch {
    return {};
  }
}

function gravarMemoria(memoria: Memoria): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(memoria));
  } catch {
    // Sem armazenamento, o convite volta na próxima visita. É o pior caso
    // aceitável: chato, e não quebrado.
  }
}

/** Quem já converteu nunca mais vê; quem dispensou tem 30 dias de silêncio. */
function podeAparecer(): boolean {
  const { convertido, dispensadoEm } = lerMemoria();
  if (convertido) return false;
  if (!dispensadoEm) return true;
  return Date.now() - dispensadoEm > ESPERA_APOS_DISPENSA * 24 * 60 * 60 * 1000;
}

export interface Convite {
  aberto: boolean;
  /** Fecha e cala o convite pelos próximos 30 dias. */
  fechar: () => void;
  /** Chamado quando o contato é gravado: o convite não volta nunca mais. */
  aoConverter: () => void;
}

export function useConvite(habilitado: boolean): Convite {
  const [aberto, setAberto] = useState(false);
  /* Um convite por carregamento. Sem isto, voltar a rolar depois de fechar
     reabriria a caixa no mesmo minuto, que é o comportamento que faz a
     pessoa sair do site em vez de preencher. */
  const jaAbriu = useRef(false);

  useEffect(() => {
    if (!habilitado) {
      setAberto(false);
      return;
    }
    if (jaAbriu.current || !podeAparecer()) return;

    const abrir = () => {
      if (jaAbriu.current) return;
      jaAbriu.current = true;
      setAberto(true);
      desarmar();
    };

    const aoRolar = () => {
      const altura = document.documentElement.scrollHeight - window.innerHeight;
      // Página curta demais para rolar não tem sinal de rolagem para dar.
      // Quem cai numa delas é atendido pelo relógio, logo abaixo.
      if (altura < 200) return;
      if (window.scrollY / altura >= FRACAO_DE_ROLAGEM) abrir();
    };

    /* Intenção de sair: o cursor cruza o topo da janela. Só onde existe
       cursor de verdade. Em touch o mesmo evento dispara ao rolar com o
       dedo, e o convite abriria na primeira rolagem, que é o que estamos
       evitando. */
    const aoSair = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) abrir();
    };

    const relogio = window.setTimeout(abrir, SEGUNDOS_NA_PAGINA * 1000);
    const temCursor = window.matchMedia?.('(pointer: fine)').matches ?? false;

    window.addEventListener('scroll', aoRolar, { passive: true });
    if (temCursor) document.addEventListener('mouseout', aoSair);

    function desarmar() {
      window.clearTimeout(relogio);
      window.removeEventListener('scroll', aoRolar);
      document.removeEventListener('mouseout', aoSair);
    }

    return desarmar;
  }, [habilitado]);

  const fechar = useCallback(() => {
    setAberto(false);
    gravarMemoria({ ...lerMemoria(), dispensadoEm: Date.now() });
  }, []);

  const aoConverter = useCallback(() => {
    gravarMemoria({ ...lerMemoria(), convertido: true });
  }, []);

  return { aberto, fechar, aoConverter };
}
