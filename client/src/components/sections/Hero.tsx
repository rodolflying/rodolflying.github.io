import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { FaMedium } from 'react-icons/fa';
import { Link } from 'wouter';
import InteractiveLogo from '@/components/ui/InteractiveLogo';

const Hero = () => {
  const { language, t } = useLanguage();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'logo' | 'rpa' | 'ai'>('logo');

  const roles = ['IT CONSULTANT', 'PROCESS AUTOMATION', 'CLOUD ARCHITECT', 'AI INTEGRATION'];

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
      ? '/CV_eng.pdf'
      : '/CV.pdf';
    window.open(cvPath, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 hex-pattern overflow-hidden">
      {/* Background Subtle Tech Video Loop */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none filter blur-sm"
        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-41908-large.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            className="order-1 md:order-2 flex flex-col items-center justify-center w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* macOS Window Card Mockup */}
            <div className="w-full max-w-md bg-[#121212]/90 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-[#00FFC8]/5 relative">
              {/* Window Header */}
              <div className="bg-[#181818] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                {/* Window control buttons */}
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                {/* Tab select buttons */}
                <div className="flex bg-gray-950 p-0.5 rounded-lg border border-gray-850">
                  <button
                    onClick={() => setActiveTab('logo')}
                    className={`px-3 py-1 text-[10px] md:text-xs font-['Orbitron'] font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'logo'
                        ? 'bg-[#00FFC8] text-black shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Logo
                  </button>
                  <button
                    onClick={() => setActiveTab('rpa')}
                    className={`px-3 py-1 text-[10px] md:text-xs font-['Orbitron'] font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'rpa'
                        ? 'bg-[#6B38FB] text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    RPA Bot
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`px-3 py-1 text-[10px] md:text-xs font-['Orbitron'] font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'ai'
                        ? 'bg-[#FF2D55] text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    AI Agent
                  </button>
                </div>

                {/* Status dot */}
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00FFC8] animate-pulse" />
                  <span className="text-[9px] font-['Orbitron'] text-gray-500 tracking-wider">LIVE</span>
                </div>
              </div>

              {/* Window Content Screen */}
              <div className="relative h-64 md:h-80 flex items-center justify-center bg-gray-950 overflow-hidden">
                {activeTab === 'logo' && (
                  <div className="scale-90 md:scale-100 flex items-center justify-center w-full h-full">
                    <InteractiveLogo />
                  </div>
                )}

                {activeTab === 'rpa' && (
                  <div className="relative w-full h-full flex flex-col justify-between p-4 font-mono text-xs text-green-400">
                    <video
                      className="absolute inset-0 w-full h-full object-cover opacity-35"
                      src="https://assets.mixkit.co/videos/preview/mixkit-lines-of-code-in-a-software-developer-screen-34440-large.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className="relative z-10 space-y-1 bg-black/40 p-3 rounded border border-green-500/20 backdrop-blur-sm pointer-events-none select-none text-[10px] md:text-xs">
                      <p className="text-gray-500">// STAR APPS - RPA BROWSER SCRA_BOT</p>
                      <p><span className="text-[#00FFC8]">sys.init()</span>: Target: SAP Portal</p>
                      <p><span className="text-yellow-400">process.step(1)</span>: Autologin successful...</p>
                      <p><span className="text-yellow-400">process.step(2)</span>: Extracting invoices: 489 found</p>
                      <p><span className="text-yellow-400">process.step(3)</span>: Writing database entries...</p>
                      <p className="text-[#00FFC8] animate-pulse">Running automation pipeline [OK] - zero errors</p>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="relative w-full h-full flex flex-col justify-end p-4 font-mono text-xs text-blue-400">
                    <video
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                      src="https://assets.mixkit.co/videos/preview/mixkit-cyber-network-connection-background-loop-41907-large.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className="relative z-10 bg-black/55 p-3 rounded border border-blue-500/20 backdrop-blur-sm pointer-events-none select-none text-[10px] md:text-xs">
                      <p className="text-gray-500">// LLM INFERENCE AGENT</p>
                      <p className="text-white">User Prompt: <span className="text-gray-300">Parse operation logs...</span></p>
                      <p>Agent Decision: <span className="text-[#00FFC8]">Extracting entity vectors...</span></p>
                      <p className="text-[#FF2D55] animate-pulse">Tokens/sec: 145.4 | Cost: $0.0003</p>
                    </div>
                  </div>
                )}
              </div>
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
