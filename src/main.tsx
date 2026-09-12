import type { ComponentType } from 'react';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { matchPath } from 'react-router-dom';
import App from './App.tsx';
import { paginas } from './config/paginas';
import { iniciarMedicao } from './lib/medir';
import { initSentry } from './lib/sentry';
import './index.css';

// Antes de renderizar, para capturar também erros da primeira pintura.
initSentry();

/* Só define a fila e agenda o download — o gtag.js em si não entra aqui,
   e sem VITE_GA4_ID nada disso existe no pacote. */
iniciarMedicao();

const raiz = document.getElementById('root')!;

/**
 * Carrega, antes de hidratar, o módulo da página que já está na tela.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESPERAR AQUI EM VEZ DE DEIXAR O <Suspense> RESOLVER          │
 * │                                                                       │
 * │  As rotas entram por `lazy()`, e o chunk da página só é buscado na    │
 * │  primeira vez que ela renderiza. Numa SPA isso não custava nada: não  │
 * │  havia HTML nenhum, e o skeleton do <Suspense> era a primeira coisa   │
 * │  que existia.                                                         │
 * │                                                                       │
 * │  Com o HTML pré-renderizado a conta inverte. Se a hidratação começa   │
 * │  com o chunk ainda em trânsito, o React suspende, mostra o skeleton   │
 * │  do fallback — e, como essa árvore não corresponde ao HTML do         │
 * │  servidor, DESCARTA o documento inteiro e desenha tudo de novo. O     │
 * │  visitante vê a página pronta piscar e virar um esqueleto cinza, e o  │
 * │  trabalho de pré-renderizar é jogado fora no exato instante em que    │
 * │  deveria render.                                                      │
 * │                                                                       │
 * │  Resolvendo o módulo antes, a primeira renderização do cliente já     │
 * │  nasce igual ao HTML que veio do servidor: a hidratação aproveita o   │
 * │  documento em vez de substituí-lo. As outras rotas seguem em          │
 * │  `lazy()` — na navegação interna o <Suspense> volta a ser o           │
 * │  comportamento certo, porque aí não há HTML a preservar.              │
 * └───────────────────────────────────────────────────────────────────────┘
 */
async function paginaDaTela(): Promise<Record<string, ComponentType>> {
  const caminho = window.location.pathname;
  /* Igualdade primeiro, padrão depois: `/artigos` é rota própria e não
     pode ser capturada por `/artigos/:slug`. */
  const atual =
    paginas.find((p) => p.rota === caminho) ?? paginas.find((p) => matchPath(p.rota, caminho));
  if (atual) return { [atual.rota]: (await atual.carregar()).default };
  // Endereço sem rota: o servidor entregou o 404.html, que é o NotFound.
  return { '*': (await import('./pages/NotFound')).default };
}

/*
  `createRoot` continua como saída de emergência: em `vite dev` não há
  pré-renderização, o `#root` chega vazio e `hydrateRoot` sobre um
  contêiner vazio quebra.

  A espera é escrita com `.then` e não com `await` no topo do módulo
  porque `await` de nível superior exige um alvo de navegador mais novo
  do que o que o build compila — e baixar esse alvo para acomodar uma
  linha custaria compatibilidade em toda a base de código.
*/
if (raiz.hasChildNodes()) {
  paginaDaTela().then((resolvidos) => {
    hydrateRoot(
      raiz,
      <StrictMode>
        <App resolvidos={resolvidos} />
      </StrictMode>,
    );
  });
} else {
  createRoot(raiz).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
