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
    // O cabeçalho não é mais transparente sobre o hero: a Direção B trata a
    // navegação como cabeçalho de documento, sempre presente e sempre com a
    // régua embaixo. Perdeu o backdrop-blur junto com o resto do desfoque.
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 border-b border-white/12 bg-brand-dark transition-[padding] duration-200',
        isScrolled || !isHome ? 'py-3' : 'py-4',
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
          <span className="text-[14.5px] leading-none font-bold tracking-tight text-white">
            INSTITUTO BRUNO SENA
          </span>
          <span className="rotulo hidden border-l border-white/15 pl-3 lg:block">
            {site.shortName}
          </span>
        </Link>

        <ul className="hidden items-center gap-6 text-[13.5px] text-brand-platinum lg:flex">
          {courseLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                aria-current={pathname === link.to ? 'page' : undefined}
                className={cn(
                  'border-b border-transparent pb-0.5 transition-colors hover:text-brand-accent',
                  pathname === link.to && 'border-brand-accent font-semibold text-brand-accent',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={isHome ? '#formacoes' : routes.home}
            className="hidden bg-brand-accent px-5 py-2.5 text-[13.5px] font-semibold text-brand-dark transition-colors hover:bg-[#f0d488] sm:block"
          >
            Matrícula
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            className="p-2 text-white transition-colors hover:bg-white/5 lg:hidden"
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
            className="absolute top-full right-0 left-0 overflow-hidden border-b border-white/12 bg-brand-dark lg:hidden"
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
                  <span className="dado text-[12px] text-brand-quiet">
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
