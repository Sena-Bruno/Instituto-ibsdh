import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import Seo from '../components/Seo';
import { artigosPublicados } from '../config/artigos';
import { eixos } from '../config/eixos';
import { routes } from '../config/site';
import { paletas } from '../lib/cores';
import { listaDeArtigos, organizacao, trilhaDeNavegacao } from '../lib/schema';

/**
 * Um botão do filtro por eixo.
 *
 * `aria-pressed` em vez de uma classe só: quem usa leitor de tela precisa
 * ouvir que o filtro está ativo, e cor sozinha não diz isso a ninguém —
 * nem a quem não enxerga, nem a quem não distingue as duas cores.
 */
function BotaoDeFiltro({
  ativo,
  aoClicar,
  children,
}: {
  ativo: boolean;
  aoClicar: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-pressed={ativo}
      className={`rounded-full border px-4 py-2 font-display text-[13px] font-semibold tracking-[0.04em] transition-colors ${
        ativo
          ? 'border-brand-accent bg-brand-accent/10 text-brand-cream'
          : 'border-white/12 text-brand-platinum hover:border-white/25 hover:text-brand-cream'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * A lista de artigos.
 *
 * Mostra apenas o que já foi revisado — ver o aviso no topo de
 * `config/artigos.ts`. Enquanto não houver nenhum artigo revisado, a
 * página existe e diz isso, em vez de exibir uma lista vazia sem
 * explicação: é o mesmo princípio das outras telas do site, que sempre
 * dizem em que pé as coisas estão.
 */
export default function Artigos() {
  const todos = useMemo(
    () => [...artigosPublicados].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm)),
    [],
  );

  /*
    ┌───────────────────────────────────────────────────────────────────────┐
    │  O FILTRO COMEÇA EM "TODOS", E ISSO NÃO É SÓ O PADRÃO ÓBVIO           │
    │                                                                       │
    │  Esta página é pré-renderizada: o HTML que o servidor entrega, e que  │
    │  o rastreador lê, é o desta primeira renderização. Se ela nascesse    │
    │  filtrada, o robô encontraria os links de um eixo só — e os outros    │
    │  artigos ficariam descobertos a partir daqui.                         │
    │                                                                       │
    │  É também o que mantém a hidratação íntegra: servidor e primeira      │
    │  pintura do cliente produzem a mesma árvore.                          │
    └───────────────────────────────────────────────────────────────────────┘
  */
  const [filtro, setFiltro] = useState<string | null>(null);

  /* Só os eixos que TÊM artigo publicado viram botão. Um filtro que
     devolve lista vazia é uma promessa quebrada em um clique. */
  const eixosComArtigo = useMemo(() => {
    const contagem = new Map<string, number>();
    for (const a of todos) contagem.set(a.eixo, (contagem.get(a.eixo) ?? 0) + 1);
    return [...contagem.entries()]
      .map(([id, quantos]) => ({ ...eixos[id as keyof typeof eixos], quantos }))
      .sort((a, b) => a.ordem - b.ordem);
  }, [todos]);

  const lista = filtro ? todos.filter((a) => a.eixo === filtro) : todos;

  return (
    <>
      <Seo
        rota={routes.artigos}
        titulo="Artigos | Instituto Bruno Sena"
        descricao="Textos sobre PNL, hipnoterapia e desenvolvimento humano — o que as técnicas fazem, o que não fazem e onde ficam os limites éticos de cada uma."
        imagemAlt="Artigos do Instituto Bruno Sena"
        dados={[
          organizacao(),
          trilhaDeNavegacao([
            { nome: 'Início', rota: routes.home },
            { nome: 'Artigos', rota: routes.artigos },
          ]),
          /* A lista inteira, e não a filtrada: os dados estruturados
             descrevem o acervo da página, não o recorte que o visitante
             escolheu na tela. */
          ...(todos.length > 0 ? [listaDeArtigos(todos)] : []),
        ]}
      />

      <main>
        <section className="relative overflow-hidden pt-32 pb-14 md:pt-40 md:pb-16">
          <div
            aria-hidden="true"
            className="brilho -top-44 left-1/2 h-[520px] w-[860px] -translate-x-1/2"
            style={{ '--brilho': paletas.accent.brilho } as React.CSSProperties}
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <p className="sobretitulo mb-6 text-brand-accent">Artigos</p>
            <h1 className="titulo-hero max-w-3xl">
              O que a técnica faz — e{' '}
              <span className="texto-gradiente">o que ela não faz.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17.5px] leading-relaxed md:text-lg">
              Textos sobre PNL, hipnoterapia e desenvolvimento humano, escritos com a mesma
              regra que vale nas formações: onde há limite, o limite é dito.
            </p>
          </div>
        </section>

        <Secao>
          {/* Com sete artigos a lista ainda se varre com o olho; com vinte,
              não. O filtro entra agora porque acrescentá-lo depois exigiria
              mudar a página quando ela já estivesse ranqueada. */}
          {eixosComArtigo.length > 1 && (
            <fieldset className="mb-9 flex flex-wrap gap-2 border-0 p-0">
              {/* <legend> invisível, e não `aria-label` num <div role="group">:
                  é a marcação que o HTML já tem para "estes controles são um
                  conjunto", e ela funciona sem depender de ARIA. */}
              <legend className="sr-only">Filtrar artigos por eixo</legend>
              <BotaoDeFiltro ativo={filtro === null} aoClicar={() => setFiltro(null)}>
                Todos <span className="text-brand-quiet">({todos.length})</span>
              </BotaoDeFiltro>

              {eixosComArtigo.map((eixo) => (
                <BotaoDeFiltro
                  key={eixo.id}
                  ativo={filtro === eixo.id}
                  aoClicar={() => setFiltro(eixo.id)}
                >
                  {eixo.nome} <span className="text-brand-quiet">({eixo.quantos})</span>
                </BotaoDeFiltro>
              ))}
            </fieldset>
          )}

          {lista.length === 0 ? (
            <div className="cartao mx-auto max-w-2xl p-8">
              <p className="sobretitulo mb-3 text-brand-accent">Em preparação</p>
              <p className="text-[17px] leading-relaxed">
                Os primeiros artigos estão escritos e em revisão. Enquanto isso, as ementas
                completas das formações estão publicadas aula por aula — é o material mais
                detalhado que temos no ar.
              </p>
              <Link to={routes.formacoes} className="btn-primary mt-7 inline-flex">
                Ver as formações
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {lista.map((artigo, i) => {
                const cor = eixos[artigo.eixo].cor;
                const p = paletas[cor];
                return (
                  <Revela key={artigo.slug} atraso={i * 0.05}>
                    <Link
                      to={`${routes.artigos}/${artigo.slug}`}
                      className={`cartao flex h-full flex-col p-7 transition-colors ${p.bordaHover}`}
                    >
                      <p className={`sobretitulo mb-4 ${p.texto}`}>{eixos[artigo.eixo].nome}</p>
                      <h2 className="font-display text-[21px] leading-snug font-bold text-brand-cream">
                        {artigo.titulo}
                      </h2>
                      <p className="mt-4 flex-1 text-[15.5px] leading-relaxed">
                        {artigo.resumo}
                      </p>
                      <span
                        className={`mt-6 inline-flex items-center gap-2 font-semibold ${p.texto}`}
                      >
                        Ler
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </Link>
                  </Revela>
                );
              })}
            </div>
          )}
        </Secao>

        <Secao elevada>
          <Cabecalho sobretitulo="Formações" titulo="Da leitura à prática">
            Os artigos explicam os conceitos. As formações treinam a execução — com prática
            supervisionada no simulador antes do primeiro atendimento real.
          </Cabecalho>
          <Link to={routes.formacoes} className="btn-primary mt-8 inline-flex">
            Ver as formações
          </Link>
        </Secao>
      </main>
    </>
  );
}
