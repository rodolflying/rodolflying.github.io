import { useTranslation } from 'react-i18next';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyber-dark py-10 border-t border-cyber-teal/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-cyber-teal rounded-full flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5L63.4 39.6L100 43.5L72.5 70L80 105L50 87.5L20 105L27.5 70L0 43.5L36.6 39.6L50 5Z" fill="#0B0C10" />
                </svg>
              </div>
              <h2 className="font-orbitron font-bold text-white text-xl">
                <span className="text-cyber-teal">STAR</span>APPS
              </h2>
            </div>
            <p className="text-cyber-light mt-2 text-sm">{t('footer.tagline')}</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:rodolfo.antonio.sep@gmail.com" className="text-cyber-light hover:text-cyber-teal transition duration-300" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
            <a href="tel:+56956632620" className="text-cyber-light hover:text-cyber-teal transition duration-300" aria-label="Phone">
              <Phone className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/rodolfo-sepulveda-847537135" target="_blank" rel="noopener noreferrer" className="text-cyber-light hover:text-cyber-teal transition duration-300" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/rodolflying" target="_blank" rel="noopener noreferrer" className="text-cyber-light hover:text-cyber-teal transition duration-300" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://medium.com/@rodolfo.antonio.sep" target="_blank" rel="noopener noreferrer" className="text-cyber-light hover:text-cyber-teal transition duration-300" aria-label="Medium">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="cyber-line my-6"></div>
        
        <div className="text-center text-cyber-light text-sm">
          <p>&copy; {currentYear} Rodolfo Sepúlveda | Star Apps SpA. {t('footer.rights')}</p>
          <p className="mt-1">{t('footer.designed')} <span className="text-cyber-teal">♥</span> {t('footer.and')} {t('footer.tech')}</p>
        </div>
      </div>
    </footer>
  );
}
