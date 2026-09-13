import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { routes } from '../config/site';
import { registrarDecisao, useDecisaoDeCookies } from '../lib/consentimento';
import { iniciarMedicao } from '../lib/medir';
import { useMontado } from '../lib/useMontado';

/**
 * O aviso de cookies — a porta que liga a medição.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  AS DUAS SAÍDAS TÊM O MESMO PESO, E ISSO É O DESENHO                  │
 * │                                                                       │
 * │  "Recusar" é um botão ao lado de "Aceitar", do mesmo tamanho e no     │
 * │  mesmo lugar. Não é um X no canto, não é um link cinza embaixo, e o   │
 * │  aviso não tem botão de fechar que se comporte como aceite.           │
 * │                                                                       │
 * │  Um aviso em que só uma das saídas é visível não coleta               │
 * │  consentimento: coleta cansaço. E consentimento obtido assim não é    │
 * │  livre, o que o torna inválido justamente no documento que ele        │
 * │  deveria sustentar.                                                   │
 * │                                                                       │
 * │  Pelo mesmo motivo, nada é medido ANTES da resposta. O padrão do      │
 * │  mercado — carregar o rastreio e esperar a recusa para desligar —     │
 * │  mede todo mundo ao menos uma vez, inclusive quem ia dizer não.       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE É UMA FAIXA, E NÃO UMA CAIXA NO MEIO DA TELA                 │
 * │                                                                       │
 * │  O Google penaliza interstício que cobre o conteúdo no celular, e     │
 * │  abre exceção justamente para aviso exigido por lei — mas a exceção   │
 * │  vale para o que é proporcionado, não para o que toma a tela. Uma     │
 * │  faixa embaixo deixa a página inteira legível e rolando atrás, que é  │
 * │  a mesma escolha já feita em `ConviteDeMaterial`.                     │
 * │                                                                       │
 * │  E ela é `fixed`: não empurra nada, então não desloca o layout — o    │
 * │  deslocamento que o Core Web Vitals mede e que o Search Console       │
 * │  reporta.                                                             │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function AvisoDeCookies() {
  const montado = useMontado();
  const decisao = useDecisaoDeCookies();

  /* Como o `ConviteDeMaterial`: nada é desenhado na pré-renderização nem na
     primeira pintura. Sem isso, quem já respondeu veria a faixa piscar por
     um quadro antes de o navegador ler a escolha guardada — e o robô
     indexaria um aviso de cookie no meio do HTML de toda página. */
  if (!montado || decisao !== null) return null;

  const aceitar = () => {
    registrarDecisao('aceito');
    /* Começa a medir agora, e não no próximo carregamento: quem aceita na
       home e navega para uma formação já é contado nessa navegação. */
    iniciarMedicao();
  };

  return (
    <AnimatePresence>
      <motion.div
        role="region"
        aria-label="Aviso sobre cookies"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25 }}
        className="cartao fixed right-0 bottom-0 left-0 z-[70] rounded-b-none border-x-0 border-b-0 p-5 sm:right-4 sm:bottom-4 sm:left-auto sm:w-[min(420px,calc(100vw-2rem))] sm:rounded-[18px] sm:border-x sm:border-b sm:p-6"
      >
        <p className="mb-4 text-[14px] leading-relaxed text-brand-platinum">
          <span className="font-semibold text-brand-cream">Usamos cookies de medição</span> para
          entender quais páginas ajudam quem chega até aqui. Eles não são necessários para o
          site funcionar, e você decide.{' '}
          <Link
            to={routes.privacidade}
            className="text-brand-accent underline underline-offset-2"
          >
            Ver a política de privacidade
          </Link>
          .
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button type="button" onClick={aceitar} className="btn-primary flex-1 justify-center">
            Aceitar
          </button>
          <button
            type="button"
            onClick={() => registrarDecisao('recusado')}
            className="btn-ghost flex-1 justify-center"
          >
            Recusar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
