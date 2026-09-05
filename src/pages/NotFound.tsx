import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { corDoCurso, listaCursos } from '../config/courses';
import { routes, whatsappLink, whatsappMessages } from '../config/site';
import { paletas } from '../lib/cores';

/**
 * A página de erro 404.
 *
 * Era um beco: orbe de blur, um "404" gigante e um único botão de voltar
 * ao início. Quem cai aqui geralmente errou o endereço de um curso — jogar
 * essa pessoa na home a obriga a procurar de novo. Agora a página lista as
 * formações e oferece o WhatsApp, que é onde a dúvida real costuma estar.
 */
export default function NotFound() {
  return (
    <main className="relative mx-auto min-h-[70vh] max-w-3xl overflow-hidden px-6 pt-36 pb-24">
      <Helmet>
        <title>Página não encontrada | Instituto Bruno Sena</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <p className="sobretitulo mb-6 text-brand-accent">Erro 404</p>

      <h1 className="titulo-secao">Esta página não existe.</h1>

      <p className="mt-5 max-w-xl text-[17px] leading-relaxed">
        O endereço pode ter mudado, ou o link que você seguiu está incompleto. As formações do
        instituto estão todas listadas abaixo.
      </p>

      <nav aria-label="Formações do instituto" className="mt-10">
        {listaCursos.map((course) => (
          <Link
            key={course.route}
            to={course.route}
            className="mb-2.5 flex items-baseline justify-between gap-4 rounded-[16px] border border-white/10 bg-brand-surface px-5 py-4 transition-colors hover:border-white/25"
          >
            <span className="text-[16px] font-semibold text-brand-cream">{course.title}</span>
            <span className={`shrink-0 font-semibold ${paletas[corDoCurso(course)].texto}`}>
              {course.situacao === 'emBreve' ? 'Em breve' : course.price}
            </span>
          </Link>
        ))}
      </nav>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link to={routes.formacoes} className="btn-primary">
          Ver todas as formações
        </Link>
        <a
          href={whatsappLink(whatsappMessages.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Falar com a coordenação
        </a>
      </div>
    </main>
  );
}
