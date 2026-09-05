import { ShieldCheck } from 'lucide-react';
import type { Course } from '../config/courses';
import { site } from '../config/site';
import { type NomeCor, paletas } from '../lib/cores';
import { cn } from '../lib/utils';

/**
 * A coluna de compra, fixa durante a rolagem.
 *
 * O problema que ela resolve: nas páginas de curso o preço aparecia no topo
 * e só voltava a aparecer cerca de 900 pixels abaixo, no bloco de checkout.
 * No meio disso — que é justamente onde está a ementa, o argumento que
 * convence — quem decidia comprar precisava procurar onde clicar, rolando
 * para cima ou para baixo até reencontrar um botão.
 *
 * Em telas estreitas não há coluna lateral, então ela vira um bloco normal
 * no fluxo: uma barra grudada no rodapé do celular cobriria o conteúdo justo
 * nas telas em que ele já é escasso.
 */
export default function RailCompra({
  curso,
  cor,
  acao,
  especificacoes,
}: {
  curso: Course;
  cor: NomeCor;
  acao: string;
  especificacoes: { rotulo: string; valor: string }[];
}) {
  const p = paletas[cor];

  return (
    <aside className="lg:sticky lg:top-28">
      <div className={cn('overflow-hidden rounded-[22px] border bg-brand-surface', p.borda)}>
        <div className={cn('h-1.5 bg-gradient-to-r', p.capa)} />

        <div className="p-7">
          <p className={cn('sobretitulo mb-5', p.texto)}>Matrícula</p>

          {curso.priceFrom && (
            <p className="mb-1.5 text-[14px] text-brand-quiet line-through">
              De {curso.priceFrom}
            </p>
          )}

          {curso.installment ? (
            <>
              <p className="font-display text-[36px] leading-none font-extrabold tracking-[-0.03em] text-brand-cream">
                12x {curso.installment}
              </p>
              <p className={cn('mt-2.5 text-[15px] font-semibold', p.texto)}>
                ou {curso.price} à vista
              </p>
            </>
          ) : (
            <p className="font-display text-[34px] leading-none font-extrabold text-brand-cream">
              {curso.price}
            </p>
          )}

          {curso.checkout ? (
            <a
              href={curso.checkout}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('mt-6 w-full', p.botao)}
            >
              {acao}
            </a>
          ) : (
            <p className="mt-6 rounded-full border border-white/12 bg-white/5 px-5 py-4 text-center text-[14px]">
              Turma ainda não aberta
            </p>
          )}

          <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-brand-quiet">
            <ShieldCheck size={15} aria-hidden="true" />7 dias de garantia · devolução integral
          </p>

          <dl className="mt-7 border-t border-white/10 pt-2">
            {especificacoes.map((item) => (
              <div
                key={item.rotulo}
                className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-3 last:border-b-0"
              >
                <dt className="text-[13.5px]">{item.rotulo}</dt>
                <dd className="text-[13.5px] font-semibold text-brand-cream">{item.valor}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[12.5px] leading-relaxed text-brand-quiet">
            Pagamento processado pela {site.paymentPlatform}. O instituto não recebe nem
            armazena os dados do seu cartão.
          </p>
        </div>
      </div>
    </aside>
  );
}
