import { Link } from 'react-router-dom';
import { courses } from '../config/courses';
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
    <footer className="border-t border-white/12 bg-brand-dark pt-14 pb-10 text-sm">
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
              <span className="text-[14.5px] leading-none font-bold tracking-tight text-white">
                INSTITUTO
                <br />
                BRUNO SENA
              </span>
            </div>
            <p className="max-w-xs text-[13.5px] leading-relaxed">{site.description}</p>
          </div>

          <nav aria-labelledby="rodape-formacoes">
            <h2 id="rodape-formacoes" className="rotulo mb-4">
              Formações
            </h2>
            <ul>
              {Object.values(courses).map((course) => (
                <li key={course.route} className="border-b border-white/8">
                  <Link
                    to={course.route}
                    className="block py-2.5 text-[13.5px] transition-colors hover:text-brand-accent"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="rotulo mb-4">Contato</h2>
            <ul>
              <li className="border-b border-white/8">
                <a
                  href={`mailto:${site.email.contact}`}
                  className="block py-2.5 text-[13.5px] break-all transition-colors hover:text-brand-accent"
                >
                  {site.email.contact}
                </a>
              </li>
              <li className="border-b border-white/8">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dado block py-2.5 text-[13.5px] transition-colors hover:text-brand-accent"
                >
                  {site.whatsapp.display}
                </a>
              </li>
              <li className="border-b border-white/8">
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
            <h2 className="rotulo mb-4">Para empresas</h2>
            <p className="text-[13.5px] leading-relaxed">
              A mesma metodologia formatada para liderança, comunicação assertiva e inteligência
              emocional em equipe.
            </p>
            <a
              href={whatsappLink(whatsappMessages.inCompany)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-4 inline-flex text-[13.5px]"
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

        <div className="space-y-4 border-t border-white/12 pt-7 text-[12.5px] text-brand-quiet">
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
