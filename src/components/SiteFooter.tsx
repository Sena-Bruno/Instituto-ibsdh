import { Link } from 'react-router-dom';
import { cursosDoEixo, eixosComCurso } from '../config/courses';
import { routes, site, whatsappLink, whatsappMessages } from '../config/site';

/**
 * Rodapé único do site.
 *
 * Antes eram 6 rodapés copiados, e as cópias já haviam divergido: uma
 * dizia "© Instituto Bruno Sena" com CNPJ e aviso legal completo, quatro
 * diziam "© IBSDH" sem CNPJ, e a da home tinha o ano 2026 fixo no código
 * enquanto as outras usavam getFullYear(). Também havia dois links mortos:
 * href="#sobre" (a âncora real é #sobre-mentor) e a Política de
 * Privacidade apontando para href="#".
 *
 * Ganhou uma quarta coluna: o In Company saiu da home, onde competia com a
 * matrícula no meio do funil, e passou a viver aqui. É outro público e
 * outra jornada de compra — quem procura treinamento corporativo procura
 * de propósito, e o rodapé é onde esse tipo de link é procurado.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-brand-dark pt-16 pb-10 text-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/logo-do-instituto.svg"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[15px] font-extrabold tracking-tight text-white">
                  INSTITUTO
                </span>
                <span className="mt-0.5 text-[9.5px] font-semibold tracking-[0.2em] text-brand-accent">
                  BRUNO SENA
                </span>
              </span>
            </div>
            <p className="max-w-xs text-[13.5px] leading-relaxed">{site.description}</p>
          </div>

          {/* Agrupado por eixo, como no cabeçalho e no catálogo: com vinte
              cursos, uma coluna de vinte links no rodapé é ilegível. */}
          <nav aria-labelledby="rodape-formacoes">
            <h2 id="rodape-formacoes" className="sobretitulo mb-5 text-brand-accent">
              Formações
            </h2>
            <div className="space-y-5">
              {eixosComCurso().map((eixo) => (
                <div key={eixo.id}>
                  <p className="mb-1.5 text-[12px] font-semibold text-brand-quiet">
                    {eixo.nome}
                  </p>
                  <ul>
                    {cursosDoEixo(eixo.id).map((curso) => (
                      <li key={curso.route}>
                        <Link
                          to={curso.route}
                          className="block py-1.5 text-[13.5px] transition-colors hover:text-brand-accent"
                        >
                          {curso.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                to={routes.formacoes}
                className="inline-block pt-1 text-[13.5px] font-semibold text-brand-accent transition-colors hover:text-brand-accent-light"
              >
                Ver o catálogo completo →
              </Link>
            </div>
          </nav>

          <div>
            <h2 className="sobretitulo mb-5 text-brand-accent">Contato</h2>
            <ul>
              <li className="border-b border-white/[0.07]">
                <a
                  href={`mailto:${site.email.contact}`}
                  className="block py-2.5 text-[13.5px] break-all transition-colors hover:text-brand-accent"
                >
                  {site.email.contact}
                </a>
              </li>
              <li className="border-b border-white/[0.07]">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2.5 text-[13.5px] transition-colors hover:text-brand-accent"
                >
                  {site.whatsapp.display}
                </a>
              </li>
              <li className="border-b border-white/[0.07]">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2.5 text-[13.5px] transition-colors hover:text-brand-accent"
                >
                  Instagram {site.social.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="sobretitulo mb-5 text-brand-emerald">Para empresas</h2>
            <p className="text-[13.5px] leading-relaxed">
              A mesma metodologia formatada para liderança, comunicação assertiva e inteligência
              emocional em equipe.
            </p>
            <a
              href={whatsappLink(whatsappMessages.inCompany)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-5 py-2.5 text-[13px] font-bold text-brand-emerald transition-colors hover:bg-brand-emerald hover:text-brand-dark"
            >
              Solicitar proposta In Company
            </a>
            <a
              href={`mailto:${site.email.partnerships}`}
              className="mt-4 block text-[13px] break-all transition-colors hover:text-brand-accent"
            >
              {site.email.partnerships}
            </a>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-8 text-[12.5px] text-brand-quiet">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link
                to={routes.privacidade}
                className="transition-colors hover:text-brand-accent"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to={routes.termos} className="transition-colors hover:text-brand-accent">
                Termos de Uso
              </Link>
            </li>
          </ul>

          <p>
            © {year} {site.legalName}. Todos os direitos reservados.
          </p>

          <p className="max-w-3xl leading-relaxed">{site.legalDisclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
