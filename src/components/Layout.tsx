import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageTransition } from '../lib/motion';
import BarraAviso from './BarraAviso';
import ConviteDeMaterial from './ConviteDeMaterial';
import FixedWhatsApp from './FixedWhatsApp';
import ScrollToTop from './ScrollToTop';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

/**
 * Moldura comum a todas as páginas: cabeçalho, rodapé, botão do WhatsApp
 * e retorno ao topo na troca de rota.
 */
export default function Layout() {
  const { pathname } = useLocation();

  /*
    A transição de página é um efeito de TROCA de rota, e só faz sentido a
    partir da segunda. Na primeira ela cobrava caro: `initial="hidden"`
    gravava `opacity:0` no envelope que contém a página inteira, e como
    esse HTML agora é pré-renderizado, um robô que aplica CSS sem executar
    JavaScript recebia o site inteiro invisível — 5% do texto da home
    legível, medido em navegador sem cabeça.

    Com `initial={false}` na primeira renderização, o bloco nasce visível
    no HTML e no primeiro passe do cliente (que precisam ser iguais, senão
    a hidratação descarta o documento). O ref vira `true` depois da
    montagem, então toda navegação seguinte anima normalmente.
  */
  const jaMontou = useRef(false);
  useEffect(() => {
    jaMontou.current = true;
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans">
      <ScrollToTop />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-accent focus:text-brand-dark focus:rounded-lg focus:font-bold"
      >
        Pular para o conteúdo
      </a>
      <BarraAviso />
      <SiteHeader />
      {/*
        A `key` no pathname refaz o bloco a cada rota, então a página nova
        entra com uma subida curta em vez de trocar num corte seco.
        Bem contido de propósito: navegar é frequente, e animação longa
        aqui vira imposto cobrado em toda troca de página.

        É <div>, e não <main>: cada página traz o próprio <main>, e dois
        aninhados são HTML inválido — a especificação admite um único
        `main` visível por documento. Enquanto tudo era montado no
        navegador, isso passava despercebido; agora o `main` duplicado
        está no HTML que o rastreador lê, e é ele que decide qual bloco é
        o conteúdo principal da página.
      */}
      <motion.div
        id="conteudo"
        key={pathname}
        variants={pageTransition}
        initial={jaMontou.current ? 'hidden' : false}
        animate="visible"
      >
        <Outlet />
      </motion.div>
      <SiteFooter />
      <FixedWhatsApp />
      {/* O convite de material. Mora aqui porque precisa valer para o site
          inteiro, e ele mesmo decide onde não aparecer e quando abrir. Não
          renderiza nada no HTML pré-renderizado: quem chega da busca, e o
          robô que rastreia, recebem só a página. */}
      <ConviteDeMaterial />
    </div>
  );
}
