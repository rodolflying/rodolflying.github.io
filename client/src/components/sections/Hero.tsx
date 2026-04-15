import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { FaMedium } from 'react-icons/fa';
import { Link } from 'wouter';
import profileImage from '@assets/foto_personal_primer_plano.jpg';

const Hero = () => {
  const { language, t } = useLanguage();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = ['SOFTWARE ENGINEER', 'DATA ENGINEER', 'DATA SCIENTIST', 'FREELANCER'];

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
        if (displayText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((currentRoleIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? 150 : 250);

    return () => clearTimeout(timeout);
  }, [displayText, currentRoleIndex, isDeleting]);

  const downloadCV = () => {
    const cvPath = language === 'en'
      ? '/src/assets/CV_eng.pdf'
      : '/src/assets/CV.pdf';
    window.open(cvPath, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 hex-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glitch-effect mb-4" data-text="RODOLFO SEPÚLVEDA">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Orbitron'] font-bold text-white tracking-wider">
                RODOLFO SEPÚLVEDA
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-['Orbitron'] mb-6 text-[#00FFC8] animate-glow">
              <span>{displayText}</span>
              <span className="ml-1 inline-block animate-pulse">|</span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg md:text-lg leading-relaxed">
              {t('hero.intro')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <span className="px-6 py-3 bg-[#00FFC8] text-[#121212] font-bold rounded-lg hover:bg-opacity-80 transition duration-300 shadow-lg shadow-[#00FFC8]/20 cursor-pointer inline-block">
                  {t('hero.contact_btn')}
                </span>
              </Link>
              <Link href="/projects">
                <span className="px-6 py-3 bg-transparent border-2 border-[#00FFC8] text-[#00FFC8] font-bold rounded-lg hover:bg-[#00FFC8]/10 transition duration-300 cursor-pointer inline-block">
                  {t('hero.projects_btn')}
                </span>
              </Link>
              <button
                onClick={downloadCV}
                className="px-6 py-3 bg-transparent border-2 border-[#FF2D55] text-[#FF2D55] font-bold rounded-lg hover:bg-[#FF2D55]/10 transition duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                {t('hero.download_cv')}
              </button>
            </div>

            <div className="flex mt-8 space-x-5">
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
                href="https://www.linkedin.com/in/rodolfo-sepulveda-847532135/"
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
                href="https://github.com/rodolflying"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00FFC8] transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00FFC8]/20 to-[#6B38FB]/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="relative z-10 border-4 border-[#00FFC8] rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <img
                  src={profileImage}
                  alt="Rodolfo Sepúlveda"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 bg-[#FF2D55] rounded-full opacity-30"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#00FFC8] rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="text-[#00FFC8] opacity-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
