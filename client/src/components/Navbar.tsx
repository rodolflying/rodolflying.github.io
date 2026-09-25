import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitch from './ui/LanguageSwitch';
import { Menu, X } from 'lucide-react';
import starAppsLogo from '@assets/START_APPS_LOGO-removebg-preview.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const [location] = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: '/', label: 'navbar.home' },
    { href: '/services', label: 'navbar.services' },
    { href: '/projects', label: 'navbar.projects' },
    { href: '/about', label: 'navbar.about' },
    { href: '/contact', label: 'navbar.contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full bg-[#070B14] bg-opacity-95 backdrop-blur-md z-50 border-b border-night-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center group">
            <img
              src={starAppsLogo}
              alt="Star Apps Logo"
              className="h-9 mr-2"
            />
            <span className="text-lg font-brand font-bold text-white tracking-wider">
              STAR <span className="text-star">APPS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-[#47E5C2] bg-[#47E5C2]/10 border border-[#47E5C2]/30'
                    : 'text-slate-400 hover:text-[#47E5C2] hover:bg-[#47E5C2]/5'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}

            <Link
              href="/contact?service=diagnostico"
              className="ml-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#47E5C2] text-[#070B14] hover:bg-[#47E5C2]/85 transition-colors"
            >
              {t('navbar.cta')}
            </Link>

            <div className="ml-2">
              <LanguageSwitch />
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitch />
            <button
              type="button"
              onClick={toggleMenu}
              className="text-slate-300 hover:text-[#47E5C2] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-night-line animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-[#47E5C2] bg-[#47E5C2]/10 border-l-2 border-[#47E5C2]'
                      : 'text-slate-400 hover:text-[#47E5C2] hover:bg-[#47E5C2]/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(link.label)}
                </Link>
              ))}
              <Link
                href="/contact?service=diagnostico"
                className="mt-2 px-4 py-3 rounded-md text-sm font-bold text-center bg-[#47E5C2] text-[#070B14]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.cta')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
