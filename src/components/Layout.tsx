import { motion } from 'motion/react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageTransition } from '../lib/motion';
import BarraAviso from './BarraAviso';
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
      */}
      <motion.main
        id="conteudo"
        key={pathname}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
      >
        <Outlet />
      </motion.main>
      <SiteFooter />
      <FixedWhatsApp />
    </div>
  );
}
