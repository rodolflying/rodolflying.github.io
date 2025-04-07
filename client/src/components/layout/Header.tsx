import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import LanguageToggle from '../LanguageToggle';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const scrollToSection = (id: string) => {
    closeMobileMenu();
    // If not on home page, go to home page first
    if (location !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-dark/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-cyber-teal rounded-full flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5L63.4 39.6L100 43.5L72.5 70L80 105L50 87.5L20 105L27.5 70L0 43.5L36.6 39.6L50 5Z" fill="#0B0C10" />
            </svg>
          </div>
          <h1 className="font-orbitron font-bold text-white text-xl">
            <span className="text-cyber-teal">STAR</span>APPS
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-white hover:text-cyber-teal transition duration-300 font-orbitron text-sm uppercase tracking-wider"
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Language Toggle + Mobile Menu */}
        <div className="flex items-center gap-4">
          <LanguageToggle />
          
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden text-white hover:text-cyber-teal transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="bg-cyber-gray px-4 py-2 md:hidden">
          <div className="flex flex-col space-y-3 py-3">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-white hover:text-cyber-teal py-2 font-orbitron text-sm uppercase tracking-wider text-left"
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
