import { lazy, Suspense } from 'react';
import { useMontado } from '../lib/useMontado';
import { SkeletonReview } from './Skeleton';

/**
 * As avaliações, carregadas só no navegador.
 *
 * `CourseReviews` importa o SDK do Firebase, que não roda em Node — e o
 * build agora pré-renderiza cada rota em HTML estático justamente em
 * Node. Um import estático puxaria Auth e Firestore para dentro do
 * bundle do servidor e derrubaria a geração da página inteira.
 *
 * Adiar também paga no navegador: o SDK (≈470 kB) deixa de ser baixado
 * junto com a página de curso e passa a entrar depois da primeira
 * pintura, que é o que o Google mede em LCP.
 *
 * O conteúdo perdido na indexação é nenhum: as avaliações sempre vieram
 * do Firestore depois da montagem, então nunca estiveram no HTML que o
 * robô lê.
 */
const CourseReviews = lazy(() =>
  import('./CourseReviews').then((m) => ({ default: m.CourseReviews })),
);

function Reserva() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-live="polite">
      <span className="sr-only">Carregando avaliações…</span>
      <SkeletonReview />
    </div>
  );
}

export default function AvaliacoesDoCurso({ courseId }: { courseId: string }) {
  if (!useMontado()) return <Reserva />;

  return (
    <Suspense fallback={<Reserva />}>
      <CourseReviews courseId={courseId} />
    </Suspense>
  );
}
