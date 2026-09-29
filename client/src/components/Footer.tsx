import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { Mail, Phone, MessageCircle, Linkedin, Github, PenLine } from 'lucide-react';
import { LOGO_SRC } from './Navbar';

const PHONE_DISPLAY = '+56 9 5663 2620';
const PHONE_E164 = '+56956632620';
const WHATSAPP = 'https://wa.me/56956632620';

const linkClass = 'text-ink-3 hover:text-star transition-colors';

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('navbar.home') },
    { href: '/services', label: t('navbar.services') },
    { href: '/projects', label: t('navbar.projects') },
    { href: '/about', label: t('navbar.about') },
    { href: '/contact', label: t('navbar.contact') },
  ];

  const social = [
    { href: WHATSAPP, label: 'WhatsApp', Icon: MessageCircle },
    { href: 'https://www.linkedin.com/in/rodolfo-sepulveda-847532135/', label: 'LinkedIn', Icon: Linkedin },
    { href: 'https://github.com/rodolflying', label: 'GitHub', Icon: Github },
    { href: 'https://medium.com/@rodolfo.antonio.sep', label: 'Medium', Icon: PenLine },
  ];

  return (
    <footer className="bg-night pt-14 pb-8 border-t border-line">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={LOGO_SRC} alt="" width={36} height={36} className="h-9 w-9" />
              <span className="text-lg font-brand font-bold text-white tracking-wider">
                STAR <span className="text-star">APPS</span>
              </span>
            </div>
            <p className="text-ink-3 text-sm leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <nav aria-label={t('footer.nav_title')}>
            <p className="text-white font-semibold mb-4 text-sm">{t('footer.nav_title')}</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${linkClass} text-sm rounded`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-white font-semibold mb-4 text-sm">{t('footer.contact_title')}</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:rodolfo.antonio.sep@gmail.com" className={`${linkClass} inline-flex items-center gap-2 rounded`}>
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  rodolfo.antonio.sep@gmail.com
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_E164}`} className={`${linkClass} inline-flex items-center gap-2 rounded num`}>
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
            <div className="flex gap-1 mt-4 -ml-2.5">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`${linkClass} inline-flex h-10 w-10 items-center justify-center rounded-lg`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-line">
          <p className="text-ink-3 text-xs">© {new Date().getFullYear()} Star Apps SpA · RUT 77.373.407-0. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
