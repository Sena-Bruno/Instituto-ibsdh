import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Artigo } from '../config/artigos';
import { eixos } from '../config/eixos';
import { routes } from '../config/site';
import { paletas } from '../lib/cores';
import Secao, { Cabecalho, Revela } from './Secao';

/**
 * "Leia também", no fim de um artigo.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  ONDE ISTO ENTRA, E POR QUE NÃO ANTES                                 │
 * │                                                                       │
 * │  Depois do texto e depois da caixa de material. A ordem é a mesma     │
 * │  lógica que já rege a oferta do material: quem terminou de ler é quem │
 * │  tem motivo para continuar; quem ainda não leu só encontraria uma     │
 * │  distração entre ele e a resposta que veio buscar.                    │
 * │                                                                       │
 * │  E depois da caixa, não antes: o e-mail vale mais do que o clique     │
 * │  para o próximo texto, porque permite voltar a falar com a pessoa.    │
 * │  Três links atraentes acima da caixa a esvaziariam.                   │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * A cor de cada cartão é a do EIXO do artigo sugerido, e não a da página
 * atual: é o que faz o bloco ser lido como "outros assuntos" em vez de
 * mais uma seção deste texto.
 */
export default function ArtigosRelacionados({ artigos }: { artigos: Artigo[] }) {
  // Um artigo sozinho no site inteiro não tem o que sugerir.
  if (artigos.length === 0) return null;

  return (
    <Secao elevada className="mt-10">
      <Cabecalho sobretitulo="Leia também" titulo="Outros textos do instituto">
        Todos escritos com o mesmo critério: o que a técnica faz, o que ela não faz, e onde ela
        não deve ser usada.
      </Cabecalho>

      <ul className="mt-9 grid gap-5 md:grid-cols-3">
        {artigos.map((artigo) => {
          const eixo = eixos[artigo.eixo];
          const p = paletas[eixo.cor];

          return (
            <li key={artigo.slug}>
              <Revela>
                <Link
                  to={`${routes.artigos}/${artigo.slug}`}
                  className="cartao flex h-full flex-col p-6 transition-colors hover:border-brand-accent/40"
                >
                  <p className={`sobretitulo mb-3 ${p.texto}`}>{eixo.nome}</p>
                  <h3 className="mb-2.5 font-display text-[17px] leading-snug font-bold text-brand-cream">
                    {artigo.titulo}
                  </h3>
                  <p className="text-[14px] leading-relaxed">{artigo.resumo}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-brand-accent">
                    Ler o artigo
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </Revela>
            </li>
          );
        })}
      </ul>
    </Secao>
  );
}
