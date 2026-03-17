import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { Mail, Phone, Linkedin, Github, Heart } from 'lucide-react';
import { FaMedium } from 'react-icons/fa';
import starAppsLogo from '@assets/START_APPS_LOGO-removebg-preview.png';

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('navbar.home') },
    { href: '/about', label: t('navbar.about') },
    { href: '/services', label: t('navbar.services') },
    { href: '/projects', label: t('navbar.projects') },
    { href: '/downloads', label: t('navbar.downloads') },
    { href: '/blog', label: t('navbar.blog') },
    { href: '/contact', label: t('navbar.contact') },
  ];

  return (
    <footer className="bg-[#0a0a0a] pt-14 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center mb-4">
              <img src={starAppsLogo} alt="Star Apps Logo" className="h-9 mr-2" />
              <span className="text-lg font-['Orbitron'] font-bold text-white">
                RODOLFO <span className="text-[#00FFC8]">SEPÚLVEDA</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Data Engineer & Developer. Automatización, IA y soluciones web personalizadas.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-[#00FFC8] text-sm transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <div className="space-y-3">
              <a
                href="mailto:rodolfo.antonio.sep@gmail.com"
                className="flex items-center gap-2 text-gray-500 hover:text-[#00FFC8] text-sm transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                rodolfo.antonio.sep@gmail.com
              </a>
              <a
                href="https://wa.me/56956632620"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-[#00FFC8] text-sm transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                +56 9 5663 2620
              </a>
            </div>
            <div className="flex gap-4 mt-5">
              <a href="https://www.linkedin.com/in/rodolfo-sepulveda-847532135/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-[#00FFC8] transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/rodolflying" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-500 hover:text-[#00FFC8] transition-colors duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://medium.com/@rodolfo.antonio.sep" target="_blank" rel="noopener noreferrer" aria-label="Medium" className="text-gray-500 hover:text-[#00FFC8] transition-colors duration-300">
                <FaMedium className="w-5 h-5" />
              </a>
              <a href="https://wa.me/56956632620" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-500 hover:text-[#00FFC8] transition-colors duration-300">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">© 2025 Rodolfo Sepúlveda. Todos los derechos reservados.</p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            {t('footer.designed_with')}
            <Heart className="w-3 h-3 text-[#FF2D55] inline" />
            {t('footer.using_tech')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
