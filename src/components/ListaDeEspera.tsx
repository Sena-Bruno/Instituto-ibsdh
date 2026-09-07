import { lazy, Suspense } from 'react';
import { useMontado } from '../lib/useMontado';

/**
 * O formulário da lista de espera, carregado só no navegador.
 *
 * Mesmo motivo de `AvaliacoesDoCurso`: `WaitlistForm` grava no Firestore
 * e o SDK não sobrevive à pré-renderização em Node. O formulário também
 * não é conteúdo indexável — é ação, não texto.
 */
const WaitlistForm = lazy(() => import('./WaitlistForm'));

function Reserva() {
  return <div aria-hidden="true" className="h-[188px] animate-pulse rounded-lg bg-white/5" />;
}

export default function ListaDeEspera({ courseId }: { courseId: string }) {
  if (!useMontado()) return <Reserva />;

  return (
    <Suspense fallback={<Reserva />}>
      <WaitlistForm courseId={courseId} />
    </Suspense>
  );
}
