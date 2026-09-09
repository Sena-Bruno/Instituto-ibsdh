import { lazy, Suspense } from 'react';
import { eixos } from '../config/eixos';
import type { Material } from '../config/materiais';
import { paletas } from '../lib/cores';
import { useMontado } from '../lib/useMontado';

/**
 * A caixa de captação no fim de um artigo, carregada só no navegador.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ELA EXISTE AQUI, E NÃO NUMA PÁGINA DE VENDA                  │
 * │                                                                       │
 * │  Os artigos são a única porta de entrada de quem ainda não decidiu    │
 * │  comprar. Quem chega por "o que é PNL" não vai clicar em "matricule-  │
 * │  se": está três passos antes disso. Mas troca o e-mail por algo que   │
 * │  o ajude a decidir — e é o único momento em que essa troca é          │
 * │  natural, porque ele acabou de ler dois mil caracteres nossos.        │
 * │                                                                       │
 * │  Sem isto, o artigo faz o trabalho todo e a pessoa vai embora sem     │
 * │  deixar como falar com ela de novo.                                   │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * O formulário entra por `lazy()` pelo mesmo motivo de `ListaDeEspera` e
 * `AvaliacoesDoCurso`: ele importa o SDK do Firebase, que não sobrevive à
 * pré-renderização em Node. O texto da caixa, esse, é renderizado no
 * servidor — a promessa está no HTML que o robô lê, e só o formulário
 * espera o navegador.
 */
const FormularioDeMaterial = lazy(() => import('./FormularioDeMaterial'));

function Reserva() {
  return <div aria-hidden="true" className="h-[236px] animate-pulse rounded-lg bg-white/5" />;
}

export default function OfertaDeMaterial({
  material,
  origem,
}: {
  material: Material;
  /** A rota desta página. Vai gravada no lead, em `origem`. */
  origem: string;
}) {
  const p = paletas[eixos[material.eixo].cor];
  const montado = useMontado();

  return (
    <aside className="cartao mx-auto mt-16 max-w-2xl p-7 md:p-8">
      <p className={`sobretitulo mb-4 ${p.texto}`}>{material.formato}</p>

      {montado ? (
        <Suspense fallback={<Reserva />}>
          <FormularioDeMaterial material={material} origem={origem} />
        </Suspense>
      ) : (
        /* O que o servidor desenha, e o que a primeira pintura do cliente
           precisa desenhar igual — senão a hidratação descarta o HTML
           pré-renderizado inteiro. Ver `lib/useMontado.ts`. */
        <>
          <h3 className="mb-3 font-display text-xl font-semibold text-brand-cream">
            {material.titulo}
          </h3>
          <p className="mb-6 text-[14.5px] leading-relaxed">{material.promessa}</p>
          <Reserva />
        </>
      )}
    </aside>
  );
}
