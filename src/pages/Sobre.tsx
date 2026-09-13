import { ArrowRight, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import Seo from '../components/Seo';
import { listaCursos } from '../config/courses';
import { routes, site, whatsappLink, whatsappMessages } from '../config/site';
import { fundador, organizacao, trilhaDeNavegacao } from '../lib/schema';

/**
 * Quem assina o método.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ESTA PÁGINA PRECISAVA EXISTIR                                │
 * │                                                                       │
 * │  O Bruno existia no site como uma SEÇÃO da home, entre dezesseis      │
 * │  outras, numa página cujo assunto é vender formação. E os sete        │
 * │  artigos declaram, nos dados estruturados, que ele é o autor —        │
 * │  apontando para `/#sobre-mentor`.                                     │
 * │                                                                       │
 * │  Isso é frágil justamente onde o site precisa ser forte. O            │
 * │  E-E-A-T pergunta "quem escreveu isto, e por que essa pessoa pode     │
 * │  escrever sobre isto" — e a resposta era uma âncora no meio de uma    │
 * │  página de vendas. Conteúdo sobre saúde e comportamento é onde o      │
 * │  Google mais pesa autoria; é a categoria em que um texto sem          │
 * │  responsável verificável simplesmente não sobe.                       │
 * │                                                                       │
 * │  E há o lado humano, que vale igual: quem lê um artigo sobre hipnose  │
 * │  clínica e pensa em fazer a formação quer saber de quem está          │
 * │  aprendendo, antes de olhar preço.                                    │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  O QUE ESTA PÁGINA NÃO FAZ                                            │
 * │                                                                       │
 * │  Não repete a seção "O seu mentor" da home. As duas falam da mesma    │
 * │  pessoa, e de propósito com recortes diferentes: a home responde "por │
 * │  que confiar em quem vende isto" no meio de uma decisão de compra;    │
 * │  aqui a pergunta é outra — quem é, o que o instituto defende, e o     │
 * │  que ele recusa fazer.                                                │
 * │                                                                       │
 * │  Duas páginas com o mesmo texto seriam conteúdo duplicado, e o        │
 * │  Google escolheria uma das duas para indexar — provavelmente a que    │
 * │  não é esta.                                                          │
 * └───────────────────────────────────────────────────────────────────────┘
 */

/** O que o instituto se recusa a fazer. Compromisso é o que tem custo. */
const compromissos = [
  {
    titulo: 'Método antes de carisma',
    texto:
      'Nenhuma técnica entra numa formação porque funcionou uma vez, com uma pessoa, num palco. Entra quando está descrita a ponto de outra pessoa reproduzi-la sem estar presente no dia.',
  },
  {
    titulo: 'Nenhuma promessa de cura',
    texto:
      'PNL, hipnoterapia e coaching não substituem tratamento de saúde. As formações ensinam onde a ferramenta ajuda e, principalmente, onde ela não deve ser usada — que é a parte que quase nenhum curso ensina.',
  },
  {
    titulo: 'Prática supervisionada, não só teoria',
    texto:
      'Assistir aula não forma ninguém. A formação exige praticar, entregar e receber devolutiva sobre a própria intervenção — inclusive pelo SENA, a avaliação por IA que lê o que você escreveu.',
  },
  {
    titulo: 'O aluno sai sabendo cobrar',
    texto:
      'Uma formação que ensina a técnica e deixa a pessoa sem saber como atender, quanto cobrar e o que dizer na primeira sessão entregou metade do que prometeu.',
  },
];

export default function Sobre() {
  return (
    <>
      <Seo
        rota={routes.sobre}
        titulo={`Sobre Bruno Sena e o Instituto | ${site.name}`}
        descricao="Quem é Bruno Sena, como nasceu o Instituto e o que ele defende — e recusa — no ensino de PNL, Hipnoterapia e Coaching."
        imagem="/brunosena.webp"
        imagemAlt="Bruno Sena, fundador do Instituto Bruno Sena"
        tipo="profile"
        dados={[
          organizacao(),
          fundador(),
          trilhaDeNavegacao([
            { nome: 'Início', rota: routes.home },
            { nome: 'Sobre', rota: routes.sobre },
          ]),
        ]}
      />

      <main>
        <Secao cor="accent" brilho brilhoEm="direita" className="pt-36">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <Revela>
              <div className="overflow-hidden rounded-[22px] border border-white/10">
                <img
                  src="/brunosena.webp"
                  width={900}
                  height={1206}
                  /* A imagem que abre a página: `eager` e prioridade alta,
                     porque é ela que o navegador deve buscar primeiro. Ver
                     o comentário de `capaPrioritaria` em Video.tsx. */
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full object-cover"
                  alt="Bruno Sena, fundador do Instituto Bruno Sena"
                />
              </div>
            </Revela>

            <div>
              <p className="sobretitulo mb-4 text-brand-accent">Sobre</p>
              <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-brand-cream md:text-5xl">
                Bruno Sena
              </h1>
              <p className="mt-4 text-[17px] leading-relaxed text-brand-cream">
                Fundador do {site.legalName} e responsável pelo método que sustenta as três
                formações.
              </p>

              <div className="mt-7 space-y-5 leading-relaxed">
                <p>
                  Não sou o terapeuta com trinta anos de clínica, e não é isso que ofereço.
                  Passei os últimos anos fazendo outra coisa: desmontando o trabalho de quem já
                  tem esses trinta anos.
                </p>
                <p>
                  Estudei como os melhores profissionais de PNL, Hipnoterapia e Coaching do
                  Brasil conduzem uma sessão — o que fazem, em que ordem, e por quê. Testei,
                  falhei, refinei e escrevi. O que sobrou dessa filtragem é o que as formações
                  ensinam: não o talento de alguém, mas o procedimento que sobrou depois que o
                  talento foi retirado da conta.
                </p>
                <p>
                  É por isso que a frase que abre a seção do instituto na home é{' '}
                  <strong className="text-brand-cream">
                    “o método é o protagonista, eu sou apenas o arquiteto”
                  </strong>
                  . Uma formação que depende do professor não forma ninguém: cria dependência do
                  professor.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <Instagram size={18} aria-hidden="true" />
                  {site.social.instagramHandle}
                </a>
                <Link to={routes.contato} className="btn-ghost">
                  Falar comigo
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Secao>

        {/* ── A credencial ──────────────────────────────────────────────── */}
        <Secao elevada>
          <div className="faixa-accent flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            <img
              src="/nlpea.webp"
              alt="Selo de membro vitalício e Practitioner da NLPEA, NLP Association of Excellence"
              width={460}
              height={662}
              loading="lazy"
              decoding="async"
              className="h-40 w-auto shrink-0 object-contain sm:h-44"
            />
            <div>
              <h2 className="mb-2 font-display text-xl font-bold text-brand-cream">
                Membro oficial da NLPEA
              </h2>
              <p className="text-[14.5px] leading-relaxed">
                Reconhecimento internacional pela Neuro Linguistic Programming Excellence
                Assurance. Certificação vitalícia que atesta conhecimento teórico e capacidade
                prática e ética no ensino de PNL em nível global. É a credencial que permite ao
                instituto emitir certificado com chancela internacional, e não apenas própria.
              </p>
            </div>
          </div>
        </Secao>

        {/* ── O que o instituto defende ─────────────────────────────────── */}
        <Secao cor="blue" elevada>
          <Cabecalho
            sobretitulo="O que sustenta o método"
            cor="blue"
            titulo="Quatro compromissos, e o que cada um custa"
          >
            Compromisso só significa alguma coisa quando implica recusar algo. Estes quatro
            definem o que as formações fazem — e o que elas deliberadamente não fazem.
          </Cabecalho>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {compromissos.map((c) => (
              <Revela key={c.titulo}>
                <div className="cartao h-full p-6">
                  <h3 className="mb-2.5 font-display text-[17px] font-bold text-brand-cream">
                    {c.titulo}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed">{c.texto}</p>
                </div>
              </Revela>
            ))}
          </div>
        </Secao>

        {/* ── Para onde ir daqui ────────────────────────────────────────── */}
        <Secao cor="accent" brilho brilhoEm="centro">
          <Cabecalho sobretitulo="A seguir" titulo="As formações do instituto" centralizado>
            Três eixos, o mesmo método por trás.
          </Cabecalho>

          <ul className="mx-auto mt-9 flex max-w-2xl flex-col gap-2.5">
            {listaCursos.map((curso) => (
              <li key={curso.id}>
                <Link
                  to={curso.route}
                  className="cartao flex items-center justify-between gap-4 p-5 transition-colors hover:border-brand-accent/40"
                >
                  <span>
                    <span className="block font-display font-bold text-brand-cream">
                      {curso.title}
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed">
                      {curso.resumo}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-brand-accent"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(whatsappMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Tirar uma dúvida
            </a>
            <a href={`mailto:${site.email.contact}`} className="btn-ghost">
              <Mail size={17} aria-hidden="true" />
              {site.email.contact}
            </a>
          </div>
        </Secao>
      </main>
    </>
  );
}
