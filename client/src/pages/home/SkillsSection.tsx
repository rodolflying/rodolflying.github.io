import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CyberpunkCard } from '@/components/ui/cyberpunk-card';
import { CyberpunkProgress } from '@/components/ui/cyberpunk-progress';
import {
  PieChart, FileSpreadsheet, File, BarChart, Database,
  Code2, Bot, Server, BrainCircuit, Award, Cpu
} from 'lucide-react';

export default function SkillsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const programmingSkills = [
    { label: 'Python', value: 90 },
    { label: 'JavaScript', value: 75 },
    { label: 'SQL', value: 85 },
    { label: 'R', value: 70 },
    { label: 'Java', value: 65 }
  ];

  const frameworks = [
    { icon: <Code2 />, label: 'React' },
    { icon: <Server />, label: 'Node.js' },
    { icon: <BrainCircuit />, label: 'TensorFlow' },
    { icon: <BarChart />, label: 'Seaborn' },
    { icon: <Bot />, label: 'Scikit-learn' },
    { icon: <Server />, label: 'Flask' },
    { icon: <Bot />, label: 'Selenium' },
    { icon: <Database />, label: 'Pandas' }
  ];

  const software = [
    { icon: <PieChart />, label: 'Power BI' },
    { icon: <FileSpreadsheet />, label: 'Excel' },
    { icon: <Award />, label: 'Project' },
    { icon: <File />, label: 'PowerPoint' },
    { icon: <BarChart />, label: 'Minitab' }
  ];

  return (
    <section id="skills" className="py-20 bg-cyber-gray/50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-orbitron text-4xl font-bold text-white inline-block relative">
            <span className="relative z-10">{t('skills.title')}</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-cyber-teal"></span>
          </h2>
          <p className="text-cyber-light mt-4 max-w-2xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Programming Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CyberpunkCard>
              <h3 className="font-orbitron text-cyber-teal text-xl mb-6 text-center">{t('skills.cards.programming')}</h3>
              <div className="space-y-5">
                {programmingSkills.map((skill, index) => (
                  <CyberpunkProgress 
                    key={index} 
                    label={skill.label} 
                    value={skill.value} 
                  />
                ))}
              </div>
            </CyberpunkCard>
          </motion.div>
          
          {/* Frameworks & Libraries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CyberpunkCard>
              <h3 className="font-orbitron text-cyber-teal text-xl mb-6 text-center">{t('skills.cards.frameworks')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {frameworks.map((framework, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-cyber-dark/50">
                    <div className="text-cyber-purple text-lg">
                      {framework.icon}
                    </div>
                    <span className="text-white">{framework.label}</span>
                  </div>
                ))}
              </div>
            </CyberpunkCard>
          </motion.div>
          
          {/* Tools & Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CyberpunkCard>
              <h3 className="font-orbitron text-cyber-teal text-xl mb-6 text-center">{t('skills.cards.tools')}</h3>
              <div className="grid grid-cols-3 gap-4">
                {['AWS', 'Docker', 'Git', 'Linux', 'GCP', 'Jenkins', 'VS Code', 'Postman', 'API'].map((tool, index) => (
                  <div key={index} className="flex flex-col items-center p-2">
                    <div className="text-cyber-yellow text-3xl mb-2">
                      <Cpu className="h-6 w-6 mx-auto" />
                    </div>
                    <span className="text-white text-sm">{tool}</span>
                  </div>
                ))}
              </div>
            </CyberpunkCard>
          </motion.div>
        </div>

        {/* Software Proficiency */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CyberpunkCard>
            <h3 className="font-orbitron text-cyber-teal text-xl mb-6 text-center">{t('skills.cards.software')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {software.map((sw, index) => (
                <div key={index} className="text-center">
                  <div className="cyber-border inline-flex items-center justify-center w-16 h-16 rounded-full mb-3">
                    <div className="text-cyber-purple text-2xl">
                      {sw.icon}
                    </div>
                  </div>
                  <h4 className="text-white font-medium">{sw.label}</h4>
                </div>
              ))}
            </div>
          </CyberpunkCard>
        </motion.div>
      </div>
    </section>
  );
}
