import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { courses } from '../config/courses';
import { routes, site } from '../config/site';
import { collapse, duration, ease } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * Cabeçalho único do site.
 *
 * Antes, cada uma das 5 páginas de curso repetia o mesmo <nav> (4 delas
 * byte a byte) e esse nav só oferecia "Voltar para Home" — não havia como
 * ir de um curso para outro pela navegação, e /master-coach era alcançável
 * por um único link em todo o site. Agora os cursos ficam sempre a um
 * clique de distância, de qualquer página.
 */

const courseLinks = [
  { label: courses.pnlPractitioner.title, to: courses.pnlPractitioner.route },
  { label: courses.masterPnl.title, to: courses.masterPnl.route },
  { label: courses.hipnoterapia.title, to: courses.hipnoterapia.route },
  { label: courses.masterCoach.title, to: courses.masterCoach.route },
  { label: courses.trilogia.title, to: courses.trilogia.route },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === routes.home;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu ao trocar de rota, senão ele fica aberto sobre a página nova.
  // pathname é gatilho, não valor lido: é a troca de rota que fecha o menu.
  // biome-ignore lint/correctness/useExhaustiveDependencies: gatilho intencional
  useEffect(() => setIsMenuOpen(false), [pathname]);

  // Esc fecha o menu — um menu em tela cheia sem saída pelo teclado prende o usuário.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  return (
    // Transparente sobre o hero e sólido depois de rolar: o hero tem brilho
    // atrás, e uma barra opaca por cima cortaria o efeito logo na entrada.
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled || !isHome
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
            <span className="font-display text-[15px] font-extrabold tracking-tight text-white">
              INSTITUTO
            </span>
            <span className="mt-0.5 text-[9.5px] font-semibold tracking-[0.2em] text-brand-accent">
              {site.shortName}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 text-[13.5px] text-brand-platinum lg:flex">
          {courseLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                aria-current={pathname === link.to ? 'page' : undefined}
                className={cn(
                  'transition-colors hover:text-white',
                  pathname === link.to && 'font-semibold text-brand-accent',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={isHome ? '#cursos' : routes.home}
            className="hidden rounded-full bg-gradient-to-br from-brand-accent-light to-brand-accent px-6 py-2.5 text-[13.5px] font-bold text-brand-dark shadow-[0_6px_20px_rgba(229,195,101,0.28)] transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:block"
          >
            Matricule-se
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            className="rounded-xl p-2 text-white transition-colors hover:bg-white/5 lg:hidden"
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

      {/* O menu usava o atributo `hidden`: abria e fechava sem transição
          nenhuma. Agora desce ao abrir e recolhe ao fechar. */}
      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.div
            id="menu-mobile"
            variants={collapse}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute top-full right-0 left-0 overflow-hidden border-b border-white/10 bg-brand-dark/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col px-6 pt-2 pb-6">
              {courseLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={pathname === link.to ? 'page' : undefined}
                  className={cn(
                    'flex items-baseline gap-4 border-b border-white/8 py-4 transition-colors hover:text-brand-accent',
                    pathname === link.to ? 'text-brand-accent' : 'text-white',
                  )}
                >
                  <span className="font-display text-[12px] font-bold text-white/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[16px] font-medium">{link.label}</span>
                </Link>
              ))}
              <Link
                to={routes.home}
                className="btn-primary mt-6 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Matrícula
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
