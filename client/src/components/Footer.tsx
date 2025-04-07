import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Phone, Linkedin, Github, Heart } from 'lucide-react';
import { FaMedium } from 'react-icons/fa';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#121212] py-10 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <img src="/star-apps-logo.svg" alt="Star Apps Logo" className="h-10 mr-3" />
              <span className="text-xl font-['Orbitron'] font-bold text-white">
                RODOLFO <span className="text-[#00FFC8]">SEPÚLVEDA</span>
              </span>
            </div>
            <p className="text-gray-400 mt-2">© 2025 All Rights Reserved</p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="mailto:rodolfo.antonio.sep@gmail.com" 
              className="text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/56956632620" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/rodolfo-sepulveda-847537135/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://medium.com/@rodolfo.antonio.sep" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
              aria-label="Medium"
            >
              <FaMedium className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/rodolfosep" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm flex justify-center items-center">
            {t('footer.designed_with')}
            <Heart className="w-4 h-4 text-[#FF2D55] mx-1 inline" />
            {t('footer.using_tech')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
