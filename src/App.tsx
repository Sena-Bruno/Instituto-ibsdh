import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { MotionConfig } from 'motion/react';
import type { ComponentType } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Rotas from './Rotas';

export default function App({
  resolvidos,
}: {
  /**
   * O componente da rota que já está na tela, quando o HTML veio
   * pré-renderizado. Ver o comentário longo em `main.tsx`: sem ele a
   * hidratação suspende e descarta o documento que o servidor entregou.
   */
  resolvidos?: Record<string, ComponentType>;
}) {
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
            <Rotas resolvidos={resolvidos} />
          </Router>
        </ErrorBoundary>
      </MotionConfig>
    </HelmetProvider>
  );
}
