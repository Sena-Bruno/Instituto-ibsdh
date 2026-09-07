import { type ComponentType, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { SkeletonPage } from './components/Skeleton';
import { paginas } from './config/paginas';

/**
 * A árvore de rotas, montada a partir de `config/paginas.ts`.
 *
 * O mesmo componente serve os dois modos de renderização:
 *
 * · no navegador, cada página entra por `lazy()` e vira um chunk próprio;
 * · na pré-renderização, o script já importou o módulo da rota e o passa
 *   em `resolvidos`, porque `renderToString` é síncrono e suspenderia em
 *   cima de um `lazy()` que ainda não resolveu.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O <Suspense> MORA AQUI, E NÃO NO App                                 │
 * │                                                                       │
 * │  Ele já esteve no App, que é usado só pelo navegador — e o resultado  │
 * │  foi uma hidratação quebrada em todas as páginas.                     │
 * │                                                                       │
 * │  O motivo é que uma fronteira de Suspense não é invisível no HTML: o  │
 * │  React a delimita com comentários (`<!--$-->` e `<!--/$-->`) e conta  │
 * │  com eles para hidratar. Com a fronteira só do lado do cliente, o     │
 * │  React procurava marcadores que o HTML do servidor não tinha,         │
 * │  concluía que a árvore não correspondia e redesenhava o documento     │
 * │  inteiro — descartando exatamente o HTML pré-renderizado que existe   │
 * │  para ser aproveitado.                                                │
 * │                                                                       │
 * │  Aqui dentro, os dois lados recebem a mesma fronteira por             │
 * │  construção. Não há como um esquecer o que o outro tem.               │
 * └───────────────────────────────────────────────────────────────────────┘
 */
const preguicosos = new Map<string, ComponentType>(
  paginas.map((p) => [p.rota, lazy(p.carregar)]),
);

const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Mostrado enquanto o chunk de uma rota é baixado.
 *
 * Antes era um spinner solto no meio da tela. O skeleton tem o formato de
 * uma página — título, texto, blocos — então a troca para o conteúdo real
 * não desloca nada, e a espera parece progresso em vez de pausa.
 *
 * Na primeira visita ele praticamente não aparece: o HTML da rota já vem
 * pronto do servidor e o `main.tsx` resolve o módulo antes de hidratar.
 * Quem o vê é a navegação interna, que ainda busca o chunk da página
 * seguinte.
 */
function Reserva() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando página…</span>
      <SkeletonPage />
    </div>
  );
}

export default function Rotas({
  resolvidos,
}: {
  /** Componentes já importados, por rota. Ver o comentário acima. */
  resolvidos?: Record<string, ComponentType>;
}) {
  return (
    <Suspense fallback={<Reserva />}>
      <Routes>
        <Route element={<Layout />}>
          {paginas.map((p) => {
            const Pagina = resolvidos?.[p.rota] ?? preguicosos.get(p.rota);
            return Pagina ? <Route key={p.rota} path={p.rota} element={<Pagina />} /> : null;
          })}
          <Route
            path="*"
            element={(() => {
              const Pagina = resolvidos?.['*'] ?? NotFound;
              return <Pagina />;
            })()}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
