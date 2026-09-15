import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { artigosDoCurso } from '../config/artigos';
import { routes } from '../config/site';
import type { NomeCor } from '../lib/cores';
import { SecaoCurso } from './PaginaCurso';
import Secao, { Cabecalho } from './Secao';

/**
 * "Antes de decidir": os artigos do instituto sobre o assunto desta
 * formação, dentro da própria página de venda.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE UM BLOCO DE LEITURA NUMA PÁGINA QUE VENDE                    │
 * │                                                                       │
 * │  Quem chegou até aqui e ainda não clicou em comprar não tem falta de  │
 * │  oferta: tem dúvida. A coluna de compra fica fixa ao lado o tempo     │
 * │  todo, então oferecer o texto não tira nada do caminho de quem já     │
 * │  decidiu — e dá um destino a quem, sem isto, ia embora.               │
 * │                                                                       │
 * │  Do lado da busca, é a ligação que faltava: os artigos recebiam link  │
 * │  só da listagem, e as páginas de curso, que concentram a autoridade   │
 * │  do site, não apontavam para nenhum. Ver `artigosDoCurso`.            │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Some sozinho quando não há artigo publicado para a formação — é o caso
 * das que ainda não têm texto escrito, e um bloco vazio prometendo
 * leitura seria pior do que bloco nenhum. É também o que mantém a
 * /jornada fora disto sem precisar de exceção: nenhum artigo aponta para
 * um pacote de formações, então lá a lista nasce vazia.
 */
export default function ArtigosDoCurso({
  rota,
  cor,
  variante = 'coluna',
}: {
  rota: string;
  cor: NomeCor;
  /**
   * Onde o bloco está sendo montado.
   *
   * `coluna` é dentro da `PaginaCurso`, na faixa de conteúdo ao lado da
   * coluna de compra — é o caso das três formações abertas. `largura` é
   * numa página que se monta com `Secao`, como a do Master Coach, que
   * ainda não tem página de curso porque ainda não tem o que vender.
   *
   * A distinção não é estética: `SecaoCurso` e `Secao` trazem paddings e
   * larguras próprios, e usar o errado desalinha o bloco de tudo o que
   * está acima dele na mesma página.
   */
  variante?: 'coluna' | 'largura';
}) {
  const artigos = artigosDoCurso(rota);
  if (artigos.length === 0) return null;

  const chamada = (
    <p className="max-w-2xl text-[16px] leading-relaxed">
      De graça e sem formulário. Se o texto fizer sentido para você, a formação é a versão
      praticada dele — com supervisão, e com o SENA do outro lado.
    </p>
  );

  const lista = (
    <ul className="grid gap-3 md:grid-cols-2">
      {artigos.map((artigo) => (
        <li key={artigo.slug}>
          <Link
            to={`${routes.artigos}/${artigo.slug}`}
            className="cartao flex h-full flex-col p-5 transition-colors hover:border-brand-accent/40"
          >
            <span className="font-display text-[16px] leading-snug font-bold text-brand-cream">
              {artigo.titulo}
            </span>
            <span className="mt-2 text-[13.5px] leading-relaxed">{artigo.resumo}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-brand-accent">
              Ler o artigo
              <ArrowRight size={13} aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  if (variante === 'largura') {
    return (
      <Secao cor={cor} elevada>
        <Cabecalho sobretitulo="Antes de decidir" cor={cor} titulo="Leia o método por escrito">
          De graça e sem formulário. Se o texto fizer sentido para você, a formação é a versão
          praticada dele — com supervisão, e com o SENA do outro lado.
        </Cabecalho>
        <div className="mt-9">{lista}</div>
      </Secao>
    );
  }

  return (
    <SecaoCurso cor={cor} sobretitulo="Antes de decidir" titulo="Leia o método por escrito">
      <div className="mb-7">{chamada}</div>
      {lista}
    </SecaoCurso>
  );
}
