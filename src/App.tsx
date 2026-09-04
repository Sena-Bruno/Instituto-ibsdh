import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { MotionConfig } from 'motion/react';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonPage } from './components/Skeleton';
import { routes } from './config/site';

// Cada rota vira um chunk próprio. Antes, as 7 páginas (≈4.400 linhas,
// só a home com 1.455) eram importadas estaticamente e iam todas no
// mesmo bundle inicial.
const Home = lazy(() => import('./pages/Home'));
const PNLPractitioner = lazy(() => import('./pages/PNLPractitioner'));
const MasterPNL = lazy(() => import('./pages/MasterPNL'));
const Hipnoterapia = lazy(() => import('./pages/Hipnoterapia'));
const Jornada = lazy(() => import('./pages/Jornada'));
const MasterCoach = lazy(() => import('./pages/MasterCoach'));
const Privacidade = lazy(() => import('./pages/Privacidade'));
const Termos = lazy(() => import('./pages/Termos'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Mostrado enquanto o chunk da rota é baixado.
 *
 * Antes era um spinner solto no meio da tela. O skeleton tem o formato
 * de uma página — título, texto, blocos — então a troca para o conteúdo
 * real não desloca nada, e a espera parece progresso em vez de pausa.
 */
function PageFallback() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando página…</span>
      <SkeletonPage />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      {/*
        reducedMotion="user" faz o Motion desligar as animações de quem
        pediu menos movimento no sistema. A regra em index.css cobre
        transições de CSS, mas o Motion anima por JavaScript e passaria
        por cima dela — sem isto, a preferência seria respeitada só pela
        metade do site.
      */}
      <MotionConfig reducedMotion="user">
        <ErrorBoundary>
          <Router>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path={routes.home} element={<Home />} />
                  <Route path={routes.pnlPractitioner} element={<PNLPractitioner />} />
                  <Route path={routes.masterPnl} element={<MasterPNL />} />
                  <Route path={routes.hipnoterapia} element={<Hipnoterapia />} />
                  <Route path={routes.jornada} element={<Jornada />} />
                  <Route path={routes.masterCoach} element={<MasterCoach />} />
                  <Route path={routes.privacidade} element={<Privacidade />} />
                  <Route path={routes.termos} element={<Termos />} />
                  <Route path={routes.admin} element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </MotionConfig>
    </HelmetProvider>
  );
}
