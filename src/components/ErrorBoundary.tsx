import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { captureException } from '../lib/sentry';

/**
 * Impede que um erro em uma página derrube o site inteiro.
 * Sem isto, qualquer exceção durante a renderização deixa a tela em branco.
 */
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro não tratado na interface:', error, info);
    // Sem isto, o erro que derruba a página fica só no console de quem
    // não vai reportar nada — justamente o mais importante de saber.
    captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6 text-center">
        <div className="max-w-md">
          <AlertTriangle className="text-brand-accent mx-auto mb-6" size={48} aria-hidden="true" />
          <h1 className="font-display text-3xl font-bold text-white mb-4">
            Algo saiu do previsto
          </h1>
          <p className="text-brand-platinum/80 mb-8">
            Não conseguimos carregar esta página. Recarregar costuma resolver.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mx-auto"
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }
}
