import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cursosDoEixo, eixosComCurso } from '../config/courses';
import { routes, site } from '../config/site';
import { paletas } from '../lib/cores';
import { collapse, duration, ease } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * Cabeçalho único do site.
 *
 * Antes, cada uma das 5 páginas de curso repetia o mesmo <nav> (4 delas
 * byte a byte) e esse nav só oferecia "Voltar para Home" — não havia como
 * ir de um curso para outro pela navegação, e /master-coach era alcançável
 * por um único link em todo o site.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE OS CURSOS NÃO FICAM MAIS SOLTOS NA BARRA                     │
 * │                                                                       │
 * │  O catálogo do instituto vai crescer muito além dos cinco cursos de   │
 * │  hoje. Cinco links soltos na barra cabem; vinte, não — e pela lei de  │
 * │  Hick o tempo de decisão cresce com o número de opções visíveis ao    │
 * │  mesmo tempo.                                                         │
 * │                                                                       │
 * │  Então a barra tem um item só, "Formações", que abre um painel        │
 * │  agrupado por eixo. Troca "escolha entre 20" por "escolha entre 4,    │
 * │  depois entre 5" — e o painel é montado a partir de                   │
 * │  `config/courses.ts`, então curso novo aparece nele sozinho.          │
 * │                                                                       │
 * │  O painel abre no clique, não no passar do mouse: menu que abre por   │
 * │  hover dispara sem intenção e é inoperável em tela de toque.          │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPainelOpen, setIsPainelOpen] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isHome = pathname === routes.home;
  const eixos = eixosComCurso();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha tudo ao trocar de rota, senão o menu fica aberto sobre a página nova.
  // pathname é gatilho, não valor lido: é a troca de rota que fecha.
  // biome-ignore lint/correctness/useExhaustiveDependencies: gatilho intencional
  useEffect(() => {
    setIsMenuOpen(false);
    setIsPainelOpen(false);
  }, [pathname]);

  // Esc fecha — um painel sem saída pelo teclado prende quem navega por Tab.
  useEffect(() => {
    if (!isMenuOpen && !isPainelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsMenuOpen(false);
      setIsPainelOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen, isPainelOpen]);

  // Clique fora fecha o painel. Sem isso ele fica aberto enquanto a pessoa
  // tenta interagir com a página atrás dele.
  useEffect(() => {
    if (!isPainelOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!painelRef.current?.contains(e.target as Node)) setIsPainelOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isPainelOpen]);

  const emCurso = pathname !== routes.home && pathname !== routes.formacoes;

  return (
    // Transparente sobre o hero e sólido depois de rolar: o hero tem brilho
    // atrás, e uma barra opaca por cima cortaria o efeito logo na entrada.
    //
    // `sticky`, e não `fixed`. Com `fixed` o cabeçalho saía do fluxo e subia
    // por cima da barra de aviso, que passava a ser lida por baixo dele.
    // Grudado, ele começa embaixo da barra, deixa a barra rolar para fora e
    // só então encosta no topo — que é o comportamento das referências.
    <header
      className={cn(
        'sticky top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled || !isHome || isPainelOpen
          ? 'border-b border-white/10 bg-brand-dark/85 py-3 backdrop-blur-xl'
          : 'border-b border-transparent py-5',
      )}
    >
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6"
      >
        <Link
          to={routes.home}
          className="flex shrink-0 items-center gap-3"
          aria-label="Instituto Bruno Sena — página inicial"
        >
          <img
            src="/logo-do-instituto.svg"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 object-contain"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-extrabold tracking-tight text-brand-cream">
              INSTITUTO
            </span>
            <span className="mt-0.5 text-[9.5px] font-semibold tracking-[0.2em] text-brand-accent">
              {site.shortName}
            </span>
          </span>
        </Link>

        <div ref={painelRef} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[14px] text-brand-platinum">
            <li>
              <button
                type="button"
                onClick={() => setIsPainelOpen((open) => !open)}
                aria-expanded={isPainelOpen}
                aria-controls="painel-formacoes"
                className={cn(
                  'flex items-center gap-1.5 transition-colors hover:text-brand-cream',
                  (emCurso || pathname === routes.formacoes) &&
                    'font-semibold text-brand-cream',
                )}
              >
                Formações
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isPainelOpen ? 180 : 0 }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                  className="block"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>
            </li>
            <li>
              <Link
                to={`${routes.home}#sena`}
                className="transition-colors hover:text-brand-cream"
              >
                O SENA
              </Link>
            </li>
            <li>
              <Link
                to={`${routes.home}#sobre-mentor`}
                className="transition-colors hover:text-brand-cream"
              >
                O instituto
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={routes.formacoes}
            className="hidden rounded-full bg-brand-accent px-6 py-2.5 font-display text-[13px] font-semibold tracking-[0.06em] text-brand-dark uppercase transition-colors hover:bg-brand-accent-light sm:block"
          >
            Matricule-se
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            className="rounded-xl p-2 text-brand-cream transition-colors hover:bg-white/5 lg:hidden"
          >
            <motion.span
              key={isMenuOpen ? 'fechar' : 'abrir'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: duration.instant, ease: ease.out }}
              className="block"
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </motion.span>
          </button>
        </div>
      </nav>

      {/* Painel de formações, agrupado por eixo. Ganha colunas conforme o
          instituto ganha eixos, sem virar uma lista de vinte links. */}
      <AnimatePresence initial={false}>
        {isPainelOpen && (
          <motion.div
            id="painel-formacoes"
            variants={collapse}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full right-0 left-0 hidden overflow-hidden border-b border-white/10 bg-brand-dark shadow-[0_18px_50px_rgba(0,0,0,0.55)] lg:block"
          >
            <div className="mx-auto max-w-7xl px-6 py-9">
              <div className="grid gap-8 md:grid-cols-4">
                {eixos.map((eixo) => (
                  <div key={eixo.id}>
                    <p className={cn('sobretitulo mb-4', paletas[eixo.cor].texto)}>
                      {eixo.nome}
                    </p>
                    <ul className="space-y-1">
                      {cursosDoEixo(eixo.id).map((curso) => (
                        <li key={curso.route}>
                          <Link
                            to={curso.route}
                            aria-current={pathname === curso.route ? 'page' : undefined}
                            className={cn(
                              'block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5',
                              pathname === curso.route
                                ? 'text-brand-cream'
                                : 'text-brand-platinum',
                            )}
                          >
                            <span className="block text-[14px] font-medium">{curso.title}</span>
                            <span className="mt-0.5 block text-[12.5px] text-brand-quiet">
                              {curso.situacao === 'emBreve' ? 'Em breve' : curso.price}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link
                to={routes.formacoes}
                className="mt-7 inline-flex border-t border-white/10 pt-6 text-[14px] font-semibold text-brand-accent transition-colors hover:text-brand-accent-light"
              >
                Ver o catálogo completo →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu do celular: a mesma lista, empilhada e agrupada. */}
      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.div
            id="menu-mobile"
            variants={collapse}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full right-0 left-0 max-h-[75vh] overflow-y-auto border-b border-white/10 bg-brand-dark shadow-[0_18px_50px_rgba(0,0,0,0.55)] lg:hidden"
          >
            <div className="flex flex-col px-6 pt-4 pb-7">
              {eixos.map((eixo) => (
                <div key={eixo.id} className="mb-5">
                  <p className={cn('sobretitulo mb-2', paletas[eixo.cor].texto)}>{eixo.nome}</p>
                  {cursosDoEixo(eixo.id).map((curso) => (
                    <Link
                      key={curso.route}
                      to={curso.route}
                      aria-current={pathname === curso.route ? 'page' : undefined}
                      className={cn(
                        'flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-3.5 transition-colors',
                        pathname === curso.route ? 'text-brand-accent' : 'text-brand-cream',
                      )}
                    >
                      <span className="text-[15.5px] font-medium">{curso.title}</span>
                      <span className="shrink-0 text-[12.5px] text-brand-quiet">
                        {curso.situacao === 'emBreve' ? 'Em breve' : curso.price}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}

              <Link
                to={routes.formacoes}
                className="btn-primary w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver o catálogo completo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
