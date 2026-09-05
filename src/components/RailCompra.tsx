import type { Course } from '../config/courses';
import { site } from '../config/site';
import { Especificacao } from './Tabela';

/**
 * A coluna de compra, fixa durante a rolagem.
 *
 * O problema que ela resolve: nas páginas de curso o preço aparecia no topo
 * e só voltava a aparecer cerca de 900 pixels abaixo, no bloco de checkout.
 * No meio disso — que é justamente onde está a ementa, o argumento que
 * convence — quem decidia comprar precisava procurar onde clicar, rolando
 * para cima ou para baixo até reencontrar um botão.
 *
 * Agora o preço e a ação acompanham a leitura em telas largas. Em telas
 * estreitas não há coluna lateral, então ela vira um bloco normal no fluxo:
 * uma barra grudada no rodapé do celular cobriria o conteúdo justo nas
 * telas em que ele já é escasso.
 */
export default function RailCompra({
  curso,
  /** Texto do botão. Vale a pena ser específico do curso. */
  acao,
  especificacoes,
}: {
  curso: Course;
  acao: string;
  especificacoes: { rotulo: string; valor: string }[];
}) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="bloco p-6">
        <p className="rotulo mb-5">Matrícula</p>

        {curso.priceFrom && (
          <p className="mb-1 text-[14px] text-brand-quiet line-through">De {curso.priceFrom}</p>
        )}

        {curso.installment ? (
          <>
            <p className="font-display text-[34px] leading-none font-semibold tracking-tight text-white">
              12x {curso.installment}
            </p>
            <p className="mt-2 text-[14.5px] text-brand-accent">ou {curso.price} à vista</p>
          </>
        ) : (
          <p className="font-display text-[34px] leading-none font-semibold tracking-tight text-white">
            {curso.price}
          </p>
        )}

        {curso.checkout ? (
          <a
            href={curso.checkout}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full"
          >
            {acao}
          </a>
        ) : (
          <p className="mt-6 border border-white/12 px-5 py-4 text-center text-[14px]">
            Turma ainda não aberta
          </p>
        )}

        <p className="rotulo mt-4 text-center normal-case">
          7 dias de garantia · devolução integral
        </p>

        <div className="mt-6 border-t border-white/12 pt-2">
          <Especificacao itens={especificacoes} />
        </div>

        <p className="mt-5 text-[12.5px] leading-relaxed text-brand-quiet">
          Pagamento processado pela {site.paymentPlatform}. O instituto não recebe nem armazena
          os dados do seu cartão.
        </p>
      </div>
    </aside>
  );
}
