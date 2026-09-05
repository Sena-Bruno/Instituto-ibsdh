import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { courses } from '../config/courses';
import { routes, whatsappLink, whatsappMessages } from '../config/site';

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
    <main className="grade mx-auto min-h-[70vh] max-w-3xl px-6 pt-36 pb-24">
      <Helmet>
        <title>Página não encontrada | Instituto Bruno Sena</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <p className="rotulo-accent mb-6">Erro 404</p>

      <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
        Esta página não existe.
      </h1>

      <p className="mt-5 max-w-xl text-[17px] leading-relaxed">
        O endereço pode ter mudado, ou o link que você seguiu está incompleto. As formações do
        instituto estão todas listadas abaixo.
      </p>

      <nav aria-label="Formações do instituto" className="mt-10 border-t border-white/12">
        {Object.values(courses).map((course) => (
          <Link
            key={course.route}
            to={course.route}
            className="flex items-baseline justify-between gap-4 border-b border-white/8 py-4 transition-colors hover:bg-white/[0.03]"
          >
            <span className="text-[16px] font-semibold text-white">{course.title}</span>
            <span className="dado text-[13.5px] text-brand-accent">{course.price}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link to={routes.home} className="btn-primary">
          Ir para a página inicial
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
