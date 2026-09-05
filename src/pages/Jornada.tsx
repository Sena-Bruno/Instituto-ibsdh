import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import Faq from '../components/Faq';
import Secao, { SecaoIntro, SecaoTitulo } from '../components/Secao';
import { combos, courses } from '../config/courses';
import { routes, site, whatsappLink } from '../config/site';
import { cn } from '../lib/utils';

/**
 * A escada de valor: os quatro caminhos de compra.
 *
 * Dois deles — os combos de dois cursos — não têm produto próprio na
 * plataforma de pagamento. A página anunciava o preço do pacote e mandava
 * para o checkout de um curso avulso, por outro valor. Enquanto os links
 * não existem, o botão desses dois leva à coordenação no WhatsApp; o aviso
 * completo está em src/config/courses.ts.
 */

interface Nivel {
  numero: string;
  titulo: string;
  composicao: string;
  preco: string;
  precoDe?: string;
  parcela?: string;
  economia?: string;
  inclui: string[];
  paraQuem: string;
  resultado: string;
  acao: string;
  checkout?: string;
  destaque?: boolean;
}

const niveis: Nivel[] = [
  {
    numero: '01',
    titulo: 'Practitioner',
    composicao: 'A base',
    preco: courses.pnlPractitioner.price,
    parcela: courses.pnlPractitioner.installment,
    inclui: [
      '44 aulas de fundamentos de PNL',
      'SENA básico, 5 perfis',
      'Certificado, nota 7/10',
    ],
    paraQuem: 'Nunca estudou PNL, ou tem conhecimento fragmentado.',
    resultado: 'Competência em reprogramação mental. Sessões de R$ 100 a R$ 250.',
    acao: 'Começar aqui',
    checkout: courses.pnlPractitioner.checkout,
  },
  {
    numero: '02',
    titulo: combos.terapiaBreve.title,
    composicao: combos.terapiaBreve.composicao,
    preco: combos.terapiaBreve.price,
    precoDe: combos.terapiaBreve.priceFrom,
    parcela: combos.terapiaBreve.installment,
    economia: combos.terapiaBreve.economia,
    inclui: [
      'Tudo do Practitioner',
      'Hipnoterapia Clínica completa',
      'SENA e SENA Hipno',
      'Dois certificados',
    ],
    paraQuem:
      'Quer atender rápido, com resultado imediato, sem precisar de modelagem estratégica.',
    resultado: 'Terapia breve eficaz. Sessões de R$ 150 a R$ 350.',
    acao: 'Quero resultado rápido',
    checkout: combos.terapiaBreve.checkout,
  },
  {
    numero: '03',
    titulo: combos.pnlCompleto.title,
    composicao: combos.pnlCompleto.composicao,
    preco: combos.pnlCompleto.price,
    precoDe: combos.pnlCompleto.priceFrom,
    parcela: combos.pnlCompleto.installment,
    economia: combos.pnlCompleto.economia,
    inclui: [
      'Tudo do Practitioner',
      'Master PNL completo',
      'SENA básico e SENA Avançado',
      'Dois certificados, notas 7/10 e 8/10',
    ],
    paraQuem: 'Quer excelência em PNL, do técnico ao estrategista. Não quer hipnose agora.',
    resultado: 'Referência em PNL. Sessões de R$ 300 a R$ 600.',
    acao: 'Quero dominar PNL',
    checkout: combos.pnlCompleto.checkout,
  },
  {
    numero: '04',
    titulo: 'Trilogia Premium',
    composicao: 'Practitioner + Hipnoterapia + Master PNL',
    preco: courses.trilogia.price,
    precoDe: courses.trilogia.priceFrom,
    parcela: courses.trilogia.installment,
    economia: 'R$ 338,00',
    inclui: [
      'As três formações completas',
      'SENA básico, Avançado e Hipno',
      'Três certificados',
      'Acesso vitalício a tudo',
    ],
    paraQuem: 'Quer a carreira inteira construída, sem escolher entre PNL e hipnose.',
    resultado: 'Referência de mercado, com as três credenciais.',
    acao: 'Quero dominar tudo',
    checkout: courses.trilogia.checkout,
    destaque: true,
  },
];

const perguntas = [
  {
    q: 'Posso começar pelo Master ou pela Hipnoterapia sem o Practitioner?',
    a: 'A avaliação de entrada no SENA é obrigatória. Se sua base de PNL for sólida, pode. Se não for, o Practitioner sistematiza o que está fragmentado.',
  },
  {
    q: 'Se eu comprar o Practitioner agora, posso fazer upgrade depois?',
    a: 'Sim. Você paga apenas a diferença do pacote, descontando o que já pagou. Exemplo: comprou o Practitioner por R$ 297 e quer o combo PNL Completo de R$ 1.097 — paga R$ 800.',
  },
  {
    q: 'O combo PNL Completo não inclui hipnose. Perco algo?',
    a: 'Não, é escolha estratégica. O Master dá uma profundidade em PNL que a Hipnoterapia não dá. Você pode somar a Hipnoterapia depois, por upgrade.',
  },
  {
    q: 'A Trilogia vale a pena, comparada aos combos separados?',
    a: 'Se você quer os três, sim: são R$ 338 de economia. Se quer só PNL, o combo PNL Completo é melhor. Se quer só terapia breve, o combo Terapia Breve é melhor.',
  },
];

export default function Jornada() {
  return (
    <>
      <Helmet>
        <link rel="canonical" href={`${site.url}${routes.jornada}`} />
        <title>Jornada do Herói — pacotes de formação | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Os quatro caminhos de formação do Instituto Bruno Sena, do Practitioner à Trilogia completa. Compare preço, carga horária e certificados."
        />
        <meta
          property="og:title"
          content="Jornada do Herói — pacotes de formação | Instituto Bruno Sena"
        />
        <meta
          property="og:description"
          content="Do Practitioner à Trilogia completa. Compare preço, carga horária e certificados."
        />
        <meta property="og:image" content={`${site.url}/og-image.png`} />
        <meta property="og:url" content={`${site.url}${routes.jornada}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        <section className="grade border-b border-white/8 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="rotulo-accent mb-6">Escada de valor IBSDH</p>
            <h1 className="max-w-3xl font-display text-[38px] leading-[1.06] font-semibold tracking-tight text-white sm:text-5xl md:text-[56px]">
              Escolha o seu nível de domínio.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed md:text-lg">
              Da base à maestria. Cada degrau constrói o próximo, e o SENA está em todos.
              Certificação por competência e acesso vitalício em qualquer caminho.
            </p>
          </div>
        </section>

        <Secao numero="01" rotulo="Níveis" id="niveis">
          <SecaoTitulo>Os quatro caminhos</SecaoTitulo>
          <SecaoIntro>
            A diferença entre eles não é quanto conteúdo você recebe, e sim que tipo de
            profissional você sai sendo.
          </SecaoIntro>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {niveis.map((nivel) => (
              <article
                key={nivel.numero}
                className={cn('flex flex-col p-7', nivel.destaque ? 'bloco-accent' : 'bloco')}
              >
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <span className="dado text-[13px] text-brand-quiet">{nivel.numero}</span>
                  <span className="rotulo">{nivel.composicao}</span>
                </div>

                <h3 className="font-display text-2xl font-semibold text-white">
                  {nivel.titulo}
                </h3>

                <div className="mt-5 border-y border-white/10 py-5">
                  {nivel.precoDe && (
                    <p className="text-[13.5px] text-brand-quiet line-through">
                      De {nivel.precoDe}
                    </p>
                  )}
                  <p className="mt-1 font-display text-[30px] leading-none font-semibold text-white">
                    {nivel.preco}
                  </p>
                  <p className="mt-2 text-[13.5px] text-brand-accent">
                    {nivel.parcela && <>12x {nivel.parcela}</>}
                    {nivel.economia && <> · economia de {nivel.economia}</>}
                  </p>
                </div>

                <p className="rotulo mt-5 mb-3">Inclui</p>
                <ul className="mb-5">
                  {nivel.inclui.map((item) => (
                    <li key={item} className="border-b border-white/8 py-2.5 text-[13.5px]">
                      {item}
                    </li>
                  ))}
                </ul>

                <dl className="mb-6 space-y-3 text-[13.5px] leading-relaxed">
                  <div>
                    <dt className="rotulo mb-1">Para quem</dt>
                    <dd>{nivel.paraQuem}</dd>
                  </div>
                  <div>
                    <dt className="rotulo mb-1">Resultado</dt>
                    <dd>{nivel.resultado}</dd>
                  </div>
                </dl>

                <div className="mt-auto">
                  {nivel.checkout ? (
                    <a
                      href={nivel.checkout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn('w-full', nivel.destaque ? 'btn-primary' : 'btn-outline')}
                    >
                      {nivel.acao}
                    </a>
                  ) : (
                    // Este pacote ainda não tem produto próprio na plataforma
                    // de pagamento. Mandar para o checkout de um curso avulso
                    // cobraria o valor errado — ver o aviso em courses.ts.
                    <>
                      <a
                        href={whatsappLink(
                          `Olá! Tenho interesse no ${nivel.titulo} (${nivel.composicao}), por ${nivel.preco}. Como faço para fechar?`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full"
                      >
                        {nivel.acao}
                      </a>
                      <p className="rotulo mt-3 text-center normal-case">
                        Matrícula pela coordenação
                      </p>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Secao>

        <Secao numero="02" rotulo="Comparação">
          <SecaoTitulo>Lado a lado</SecaoTitulo>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Comparação entre os quatro caminhos de formação
              </caption>
              <thead>
                <tr className="border-b border-white/12">
                  <th scope="col" className="rotulo py-3 pr-4 font-normal">
                    <span className="sr-only">Critério</span>
                  </th>
                  {niveis.map((nivel) => (
                    <th
                      key={nivel.numero}
                      scope="col"
                      className={cn(
                        'py-3 pr-4 text-[14px] font-semibold',
                        nivel.destaque ? 'text-brand-accent' : 'text-white',
                      )}
                    >
                      {nivel.titulo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { rotulo: 'Preço', valores: niveis.map((n) => n.preco) },
                  { rotulo: 'Economia', valores: niveis.map((n) => n.economia ?? '—') },
                  { rotulo: 'Carga horária', valores: ['100h', '200h', '220h', '320h'] },
                  { rotulo: 'Simuladores', valores: ['1', '2', '2', '3'] },
                  { rotulo: 'Certificados', valores: ['1', '2', '2', '3'] },
                  {
                    rotulo: 'Nível final',
                    valores: [
                      'Competente',
                      'Terapeuta breve',
                      'Estrategista em PNL',
                      'Referência de mercado',
                    ],
                  },
                ].map((linha) => (
                  <tr key={linha.rotulo} className="border-b border-white/8 align-baseline">
                    <th scope="row" className="rotulo py-3.5 pr-4 font-normal">
                      {linha.rotulo}
                    </th>
                    {linha.valores.map((valor, i) => (
                      <td
                        key={`${linha.rotulo}-${niveis[i].numero}`}
                        className={cn(
                          'py-3.5 pr-4 text-[13.5px] leading-snug',
                          niveis[i].destaque && 'text-white',
                        )}
                      >
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Secao>

        <Secao numero="03" rotulo="Recomendação">
          <SecaoTitulo>Qual é o seu momento?</SecaoTitulo>

          <ol className="mt-10 border-t border-white/12">
            {[
              { situacao: 'Estou começando do zero', indicacao: niveis[0] },
              { situacao: 'Já atendo e quero resultado mais rápido', indicacao: niveis[1] },
              { situacao: 'Quero ser referência em PNL', indicacao: niveis[2] },
              { situacao: 'Quero a carreira inteira, sem escolher', indicacao: niveis[3] },
            ].map(({ situacao, indicacao }) => (
              <li
                key={situacao}
                className="grid gap-x-6 gap-y-1 border-b border-white/8 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
              >
                <span className="text-[15px] text-white">{situacao}</span>
                <span className="text-[13.5px]">
                  <span className="text-brand-accent">{indicacao.titulo}</span>
                  <span className="dado ml-3 text-brand-quiet">{indicacao.preco}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-2xl text-[14px] leading-relaxed">
            Em qualquer nível: 7 dias de garantia incondicional. Acesse, teste o SENA e decida
            se é para você.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to={routes.pnlPractitioner} className="btn-outline">
              Ver o Practitioner em detalhe
            </Link>
            <Link to={routes.home} className="btn-outline">
              Voltar às formações
            </Link>
          </div>
        </Secao>

        <Secao numero="04" rotulo="Perguntas">
          <SecaoTitulo>Dúvidas frequentes</SecaoTitulo>
          <div className="mt-10">
            <Faq items={perguntas} />
          </div>
        </Secao>

        <Secao numero="05" rotulo="Avaliações">
          <CourseReviews courseId={courses.trilogia.slug} />
        </Secao>
      </main>
    </>
  );
}
