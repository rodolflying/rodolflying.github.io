import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitch from './ui/LanguageSwitch';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "#home", label: "navbar.home" },
    { href: "#about", label: "navbar.about" },
    { href: "#skills", label: "navbar.skills" },
    { href: "#experience", label: "navbar.experience" },
    { href: "#projects", label: "navbar.projects" },
    { href: "#services", label: "navbar.services" },
    { href: "#contact", label: "navbar.contact" }
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#121212] bg-opacity-90 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img 
              src="/star-apps-logo.svg" 
              alt="Star Apps Logo" 
              className="h-10 mr-3" 
            />
            <span className="text-xl font-['Orbitron'] font-bold text-white">
              STAR <span className="text-[#00FFC8]">APPS</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="text-gray-300 hover:text-[#00FFC8] transition duration-300"
              >
                {t(link.label)}
              </a>
            ))}
            
            <LanguageSwitch />
          </div>
          
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggleMenu}
              className="text-gray-300 hover:text-[#00FFC8]"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-300 hover:text-[#00FFC8] transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(link.label)}
                </a>
              ))}
              
              <div className="pt-2">
                <LanguageSwitch isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
