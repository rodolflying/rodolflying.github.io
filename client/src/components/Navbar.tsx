import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitch from './ui/LanguageSwitch';
import { Menu, X } from 'lucide-react';

export const LOGO_SRC = '/star-apps-logo.svg';

/** Recursos and Blog stay reachable by URL but are out of the navigation. */
const NAV_LINKS = [
  { href: '/', label: 'navbar.home' },
  { href: '/services', label: 'navbar.services' },
  { href: '/projects', label: 'navbar.projects' },
  { href: '/about', label: 'navbar.about' },
  { href: '/contact', label: 'navbar.contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => (href === '/' ? location === '/' : location.startsWith(href));

  // Close on navigation.
  useEffect(() => setIsMenuOpen(false), [location]);

  // While the mobile panel is open: Esc closes it (focus back to the button) and the page behind does not scroll.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  const menuLabel = isMenuOpen
    ? (language === 'es' ? 'Cerrar menú' : 'Close menu')
    : (language === 'es' ? 'Abrir menú' : 'Open menu');

  return (
    <nav className="fixed top-0 w-full bg-night/95 backdrop-blur-md z-50 border-b border-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center gap-2 rounded-lg">
            <img src={LOGO_SRC} alt="" width={36} height={36} className="h-9 w-9" />
            <span className="text-lg font-brand font-bold text-white tracking-wider">
              STAR <span className="text-star">APPS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href) ? 'text-star bg-star/10' : 'text-ink-2 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>

            <Link
              href="/contact?service=diagnostico"
              className="ml-4 px-4 py-2 rounded-lg text-sm font-semibold bg-star text-night hover:bg-star-soft transition-colors active:scale-[0.98]"
            >
              {t('navbar.cta')}
            </Link>

            <span aria-hidden="true" className="mx-4 h-6 w-px bg-line" />
            <LanguageSwitch />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitch />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-2 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={menuLabel}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-height panel under the bar; hidden (not unmounted) so aria-controls always points at something. */}
      <div
        id="mobile-menu"
        hidden={!isMenuOpen}
        className="lg:hidden absolute inset-x-0 top-full h-[100dvh] bg-night/[0.98] border-t border-line"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive(link.href) ? 'text-star bg-star/10' : 'text-ink-2 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t(link.label)}
            </Link>
          ))}
          <Link
            href="/contact?service=diagnostico"
            className="mt-4 px-4 py-3 rounded-xl text-base font-semibold text-center bg-star text-night hover:bg-star-soft transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('navbar.cta')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
