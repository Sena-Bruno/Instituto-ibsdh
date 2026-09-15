import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { LazyMotion, MotionConfig } from 'motion/react';
import type { ComponentType } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Rotas from './Rotas';

/** Os recursos de animação, buscados só depois que a página já está de pé.
 *  Ver `lib/animacao.ts` — o módulo separado é o que permite adiá-los. */
const carregarAnimacao = () => import('./lib/animacao').then((r) => r.domMax);

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
        {/*
          ┌─────────────────────────────────────────────────────────────┐
          │  O MOTOR DE ANIMAÇÃO DESCE DEPOIS DA HIDRATAÇÃO             │
          │                                                             │
          │  A API `motion.div` arrasta o motor inteiro por construção: │
          │  o proxy pode receber qualquer recurso, então não há        │
          │  tree-shaking possível. Medido isolando o pacote: 126 kB    │
          │  minificados, 42 kB comprimidos — dentro do chunk de        │
          │  ENTRADA, baixados e executados antes da primeira interação │
          │  de TODA página. Eram 29% do JavaScript crítico, cobrados   │
          │  inclusive de um artigo que é texto corrido.                │
          │                                                             │
          │  Com `m` + LazyMotion, o que fica no caminho crítico são    │
          │  poucos kB de interface. O `domAnimation` chega por         │
          │  import() depois, e nada some no meio: a primeira pintura   │
          │  já é a do HTML pré-renderizado, e as animações daqui são   │
          │  todas de interação — FAQ, ementa, troca de rota — que só   │
          │  acontecem depois de a pessoa tocar em alguma coisa.        │
          │                                                             │
          │  `strict` é o que torna a troca segura: com ele, um         │
          │  `motion.div` esquecido no lugar de `m.div` lança erro em   │
          │  desenvolvimento, em vez de devolver o pacote inteiro para  │
          │  o chunk de entrada sem ninguém notar.                      │
          └─────────────────────────────────────────────────────────────┘
        */}
        <LazyMotion strict features={carregarAnimacao}>
          <ErrorBoundary>
            <Router>
              <Rotas resolvidos={resolvidos} />
            </Router>
          </ErrorBoundary>
        </LazyMotion>
      </MotionConfig>
    </HelmetProvider>
  );
}
