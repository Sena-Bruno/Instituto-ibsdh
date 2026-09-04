import { Link } from 'react-router-dom';
import { courses } from '../config/courses';
import { routes, site, whatsappLink } from '../config/site';

/**
 * Rodapé único do site.
 *
 * Antes eram 6 rodapés copiados, e as cópias já haviam divergido: uma
 * dizia "© Instituto Bruno Sena" com CNPJ e aviso legal completo, quatro
 * diziam "© IBSDH" sem CNPJ, e a da home tinha o ano 2026 fixo no código
 * enquanto as outras usavam getFullYear(). Também havia dois links mortos:
 * href="#sobre" (a âncora real é #sobre-mentor) e a Política de
 * Privacidade apontando para href="#".
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-white/10 pt-16 pb-10 text-sm text-brand-platinum/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-3 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-do-instituto.svg"
                alt=""
                width={48}
                height={48}
                className="w-11 h-11 object-contain"
              />
              <span className="flex flex-col">
                <span className="font-display font-bold text-base leading-none tracking-tight text-white">
                  INSTITUTO
                </span>
                <span className="font-display font-light text-[10px] tracking-[0.2em] text-brand-accent">
                  BRUNO SENA
                </span>
              </span>
            </div>
            <p className="max-w-xs leading-relaxed">{site.description}</p>
          </div>

          <nav aria-labelledby="rodape-formacoes">
            <h2
              id="rodape-formacoes"
              className="font-bold mb-5 text-xs uppercase tracking-widest text-white/50"
            >
              Formações
            </h2>
            <ul className="space-y-3">
              {Object.values(courses).map((course) => (
                <li key={course.route}>
                  <Link to={course.route} className="hover:text-brand-accent transition-colors">
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/50">
              Contato
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${site.email.contact}`}
                  className="hover:text-brand-accent transition-colors break-all"
                >
                  {site.email.contact}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email.partnerships}`}
                  className="hover:text-brand-accent transition-colors break-all"
                >
                  {site.email.partnerships}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-accent transition-colors"
                >
                  {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-accent transition-colors"
                >
                  Instagram {site.social.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center space-y-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <li>
              <Link
                to={routes.privacidade}
                className="hover:text-brand-accent transition-colors"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to={routes.termos} className="hover:text-brand-accent transition-colors">
                Termos de Uso
              </Link>
            </li>
          </ul>

          <p>
            © {year} {site.legalName}. Todos os direitos reservados.
          </p>

          <p className="max-w-2xl mx-auto text-xs text-brand-platinum/70">
            {site.legalDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
