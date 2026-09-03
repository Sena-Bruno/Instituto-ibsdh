import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Leva a página ao topo a cada troca de rota.
 *
 * Substitui o `window.scrollTo(0, 0)` que estava duplicado em 5 páginas —
 * e que faltava justamente na home, então voltar de um curso para a home
 * deixava o visitante no meio da página.
 *
 * Respeita âncoras (#cursos, #checkout): se houver hash, rola até o alvo.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
