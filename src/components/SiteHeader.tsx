import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { routes } from '../config/site';
import { courses } from '../config/courses';
import { collapse, duration, ease } from '../lib/motion';

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled || !isHome
          ? 'bg-brand-dark/90 backdrop-blur-md border-white/10 py-3'
          : 'bg-transparent border-transparent py-5',
      )}
    >
      <nav
        aria-label="Navegação principal"
        className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6"
      >
        <Link
          to={routes.home}
          className="flex items-center gap-2 shrink-0 rounded-lg"
          aria-label="Instituto Bruno Sena — página inicial"
        >
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
        </Link>

        <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-brand-platinum">
          {courseLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                aria-current={pathname === link.to ? 'page' : undefined}
                className={cn(
                  'transition-colors hover:text-brand-accent',
                  pathname === link.to && 'text-brand-accent font-bold',
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
            className="hidden sm:block px-5 py-2.5 bg-brand-accent text-brand-dark rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Matricule-se
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
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
            className="lg:hidden absolute top-full left-0 right-0 bg-brand-dark border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
        {courseLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            aria-current={pathname === link.to ? 'page' : undefined}
            className={cn(
              'text-lg font-medium transition-colors hover:text-brand-accent',
              pathname === link.to ? 'text-brand-accent' : 'text-white',
            )}
          >
            {link.label}
          </Link>
        ))}
        <hr className="border-white/10 my-1" />
              <Link
                to={routes.home}
                className="w-full py-4 text-center bg-brand-accent text-brand-dark rounded-xl font-bold"
              >
                Matricule-se Agora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
