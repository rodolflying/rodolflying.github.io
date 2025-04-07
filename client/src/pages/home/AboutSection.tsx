import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CyberpunkCard } from '@/components/ui/cyberpunk-card';
import { 
  User, GraduationCap, Code, Database, 
  Brain, BarChart, GitBranch 
} from 'lucide-react';

export default function AboutSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5
      }
    })
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i + 0.4,
        duration: 0.5
      }
    })
  };

  const features = [
    { icon: <Database className="h-10 w-10" />, title: t('about.features.dataEngineering'), text: t('about.features.dataEngineeringDesc') },
    { icon: <Brain className="h-10 w-10" />, title: t('about.features.aiIntegration'), text: t('about.features.aiIntegrationDesc') },
    { icon: <BarChart className="h-10 w-10" />, title: t('about.features.dataVisualization'), text: t('about.features.dataVisualizationDesc') },
    { icon: <GitBranch className="h-10 w-10" />, title: t('about.features.webDevelopment'), text: t('about.features.webDevelopmentDesc') }
  ];

  return (
    <section id="about" className="py-20 bg-cyber-gray/50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-orbitron text-4xl font-bold text-white inline-block relative">
            <span className="relative z-10">{t('about.title')}</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-cyber-teal"></span>
          </h2>
          <p className="text-cyber-light mt-4 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Professional Profile */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <CyberpunkCard>
              <div className="text-cyber-teal mb-4">
                <User className="h-8 w-8" />
              </div>
              <h3 className="font-orbitron text-white text-xl mb-3">{t('about.cards.profile.title')}</h3>
              <p className="text-cyber-light">
                {t('about.cards.profile.content')}
              </p>
            </CyberpunkCard>
          </motion.div>
          
          {/* Card 2: Education */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <CyberpunkCard>
              <div className="text-cyber-teal mb-4">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="font-orbitron text-white text-xl mb-3">{t('about.cards.education.title')}</h3>
              <ul className="text-cyber-light space-y-2">
                <li className="flex items-start">
                  <span className="text-cyber-yellow mr-2 text-lg">•</span>
                  <div>
                    <p className="font-medium">{t('about.cards.education.degree')}</p>
                    <p className="text-sm opacity-80">{t('about.cards.education.university')}, 2012-2018</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-yellow mr-2 text-lg">•</span>
                  <div>
                    <p className="font-medium">{t('about.cards.education.exchange')}</p>
                    <p className="text-sm opacity-80">{t('about.cards.education.exchangeUniversity')}, 2017-2018</p>
                  </div>
                </li>
              </ul>
            </CyberpunkCard>
          </motion.div>
          
          {/* Card 3: Languages & Tools */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <CyberpunkCard>
              <div className="text-cyber-teal mb-4">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="font-orbitron text-white text-xl mb-3">{t('about.cards.languages.title')}</h3>
              <ul className="text-cyber-light space-y-2">
                <li className="flex items-start">
                  <span className="text-cyber-yellow mr-2 text-lg">•</span>
                  <div>
                    <p className="font-medium">{t('about.cards.languages.programming')}</p>
                    <p className="text-sm opacity-80">Python, JavaScript, SQL, R, Java</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-yellow mr-2 text-lg">•</span>
                  <div>
                    <p className="font-medium">{t('about.cards.languages.human')}</p>
                    <p className="text-sm opacity-80">{t('about.cards.languages.spanish')}, {t('about.cards.languages.english')}</p>
                  </div>
                </li>
              </ul>
            </CyberpunkCard>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="text-center"
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className="text-cyber-purple text-4xl mb-3 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="font-orbitron text-white text-lg mb-1">{feature.title}</h3>
              <p className="text-cyber-light text-sm">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
