import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
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

function PageLoader() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Carregando página…</span>
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-full border-2 border-white/15 border-t-brand-accent animate-spin motion-reduce:animate-none"
      />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<PageLoader />}>
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
    </HelmetProvider>
  );
}
