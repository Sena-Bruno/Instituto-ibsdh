import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { materiais } from '../config/materiais';
import { routes } from '../config/site';
import { useDecisaoDeCookies } from '../lib/consentimento';
import { useConvite } from '../lib/useConvite';
import { useMontado } from '../lib/useMontado';

/**
 * O convite que aparece sozinho, oferecendo o material em troca do contato.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ELE EXISTE                                                   │
 * │                                                                       │
 * │  A captação de material vive no fim dos artigos, e ali funciona: quem  │
 * │  chega por "o que é PNL" lê e troca o e-mail por um guia. Mas o resto  │
 * │  do site continuou sem porta nenhuma. Quem entra pela home, compara    │
 * │  formações e vai embora sem comprar não deixa como falar com ele de    │
 * │  novo, e essa é a maioria das visitas.                                │
 * │                                                                       │
 * │  Este convite cobre esse vão, e só ele: nas rotas que já mostram a     │
 * │  caixa do material, ele não aparece. Ver `SEM_CONVITE` abaixo.         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE PROTEGE O SITE ESTÁ EM DOIS LUGARES                            │
 * │                                                                       │
 * │  1. O GATILHO, em `lib/useConvite.ts`: ele nunca abre na chegada, só   │
 * │     depois de sinal de interesse. É o que mantém o site fora da regra  │
 * │     de interstício intrusivo do Google. Leia o aviso lá antes de mexer.│
 * │                                                                       │
 * │  2. O FORMATO, aqui: no celular o convite é uma faixa embaixo, que     │
 * │     deixa a página visível e rolando atrás. No desktop é um cartão     │
 * │     central com fundo escurecido. A regra do Google mira telas         │
 * │     pequenas, e é nelas que o convite renuncia a cobrir o conteúdo.    │
 * └───────────────────────────────────────────────────────────────────────┘
 */

/*
  O formulário entra por `lazy()` pelo mesmo motivo das outras superfícies de
  captação: ele importa o SDK do Firebase, que não sobrevive à pré-renderização
  em Node. Aqui o adiamento paga duas vezes, porque este componente mora no
  Layout: sem ele, TODA rota do site carregaria o Firestore para exibir uma
  caixa que só aparece depois de 40 segundos.
*/
const FormularioDeMaterial = lazy(() => import('./FormularioDeMaterial'));

/**
 * Onde o convite NÃO aparece.
 *
 * · `/artigos/...` e a listagem já mostram a caixa do mesmo material no fim
 *   da página. Oferecer duas vezes o mesmo guia na mesma tela é o tipo de
 *   insistência que faz fechar a aba.
 * · `/materiais/...` é a página que a pessoa acabou de ganhar.
 * · `/admin` é painel interno.
 * · `/privacidade` e `/termos` são as páginas que alguém abre justamente
 *   para conferir o que fazemos com o e-mail dele. Pedir o e-mail ali é
 *   responder à pergunta errada.
 */
const SEM_CONVITE = [
  routes.artigos,
  routes.materiais,
  routes.admin,
  routes.privacidade,
  routes.termos,
];

const material = materiais[0];

export default function ConviteDeMaterial() {
  const { pathname } = useLocation();
  const montado = useMontado();
  const permitido = !SEM_CONVITE.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  /* Enquanto o aviso de cookies espera resposta, o convite não abre: são
     duas caixas no mesmo canto inferior, e a segunda a chegar cobriria a
     primeira. Pior do que a sobreposição é o que ela faria — empurrar uma
     decisão sobre dados para debaixo de uma oferta. */
  const decidiuCookies = useDecisaoDeCookies() !== null;
  const { aberto, fechar, aoConverter } = useConvite(montado && permitido && decidiuCookies);

  const caixaRef = useRef<HTMLDivElement>(null);
  const focoAnterior = useRef<Element | null>(null);

  // Esc fecha. Caixa sem saída pelo teclado prende quem navega por Tab.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto, fechar]);

  /* O foco entra na caixa quando ela abre e volta para onde estava quando
     ela fecha. Sem isso, quem usa teclado ou leitor de tela continua na
     página atrás, sem saber que algo apareceu, e depois é devolvido ao
     começo do documento. */
  useEffect(() => {
    if (!aberto) return;
    focoAnterior.current = document.activeElement;
    caixaRef.current?.focus();
    return () => {
      (focoAnterior.current as HTMLElement | null)?.focus?.();
    };
  }, [aberto]);

  if (!montado || !material) return null;

  return (
    <AnimatePresence>
      {aberto && (
        <>
          {/*
            O fundo escurecido existe só a partir de `sm`. No celular ele
            seria a própria cobertura de conteúdo que este componente evita,
            e sem ele a página continua legível e rolável atrás da faixa.
          */}
          <motion.div
            aria-hidden="true"
            onClick={fechar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] hidden bg-black/70 backdrop-blur-[2px] sm:block"
          />

          <motion.div
            ref={caixaRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="convite-titulo"
            tabIndex={-1}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="cartao fixed right-0 bottom-0 left-0 z-[90] max-h-[88vh] overflow-y-auto rounded-b-none p-6 outline-none sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:w-[min(440px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[18px] sm:p-8"
          >
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar"
              className="absolute top-4 right-4 rounded-full p-2 text-brand-quiet transition-colors hover:bg-white/5 hover:text-brand-cream"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <p className="sobretitulo mb-3 pr-8 text-brand-accent">{material.formato}</p>
            <p
              id="convite-titulo"
              className="mb-5 text-[15.5px] leading-relaxed text-brand-cream"
            >
              {material.convite}
            </p>

            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="h-[236px] animate-pulse rounded-lg bg-white/5"
                />
              }
            >
              <FormularioDeMaterial
                material={material}
                /* `convite:` na frente da rota separa, no /admin, quem veio
                   desta caixa de quem veio do fim de um artigo. São dois
                   pontos de captação com desempenho muito diferente, e sem
                   a marca eles viram um número só. */
                origem={`convite:${pathname}`}
                aoGravar={aoConverter}
              />
            </Suspense>

            <button
              type="button"
              onClick={fechar}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-brand-quiet transition-colors hover:text-brand-cream"
            >
              Agora não
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
