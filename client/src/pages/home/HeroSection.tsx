import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const { t } = useTranslation();
  const [profileImgLoaded, setProfileImgLoaded] = useState(false);

  // Preload profile image
  useEffect(() => {
    const img = new Image();
    img.src = "/attached_assets/foto_personal_primer_plano.jpg";
    img.onload = () => setProfileImgLoaded(true);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&h=1080&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark/70 via-cyber-dark/80 to-cyber-dark"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Profile image with cyber effect */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: profileImgLoaded ? 1 : 0, y: profileImgLoaded ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-48 h-48 rounded-full overflow-hidden cyber-border p-1">
              <img 
                src="/attached_assets/foto_personal_primer_plano.jpg" 
                alt="Rodolfo Sepúlveda" 
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-cyber-gray px-3 py-1 rounded-full cyber-border">
              <span className="text-cyber-teal text-xs font-orbitron animate-pulse-slow">ONLINE</span>
            </div>
          </motion.div>

          <motion.div 
            className="max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-2 tracking-tight">
              <span className="text-white">RODOLFO</span> 
              <span className="text-cyber-teal animate-glow">SEPÚLVEDA</span>
            </h1>
            <div className="cyber-line my-4"></div>
            <p className="font-orbitron text-xl text-cyber-yellow mb-2">{t('hero.title')}</p>
            <p className="text-cyber-light text-lg max-w-md mx-auto mt-4">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                variant="outline" 
                className="border-2 border-cyber-teal text-cyber-teal hover:bg-cyber-teal hover:text-cyber-dark font-orbitron px-6 py-6 rounded-lg transition duration-300 uppercase tracking-wider text-sm"
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 80,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                <Send className="mr-2 h-4 w-4" /> {t('hero.contact')}
              </Button>
              <Button 
                className="bg-cyber-teal text-cyber-dark border-2 border-cyber-teal hover:bg-transparent hover:text-cyber-teal font-orbitron px-6 py-6 rounded-lg transition duration-300 uppercase tracking-wider text-sm"
                onClick={() => window.open('/CV-Rodolfo-Sepulveda.pdf', '_blank')}
              >
                <Download className="mr-2 h-4 w-4" /> {t('hero.download')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="text-cyber-teal h-6 w-6" />
      </motion.div>
    </section>
  );
}
