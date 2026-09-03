import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import FixedWhatsApp from './FixedWhatsApp';
import ScrollToTop from './ScrollToTop';

/**
 * Moldura comum a todas as páginas: cabeçalho, rodapé, botão do WhatsApp
 * e retorno ao topo na troca de rota.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans">
      <ScrollToTop />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-accent focus:text-brand-dark focus:rounded-lg focus:font-bold"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <Outlet />
      </main>
      <SiteFooter />
      <FixedWhatsApp />
    </div>
  );
}
