import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight } from 'lucide-react';

export default function ExperienceSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const experiences = [
    {
      title: t('experience.items.dataScientist.title'),
      company: t('experience.items.dataScientist.company'),
      period: '2022-2024',
      tasks: [
        t('experience.items.dataScientist.tasks.0'),
        t('experience.items.dataScientist.tasks.1'),
        t('experience.items.dataScientist.tasks.2')
      ],
      skills: ['AWS', 'Python', 'Power BI']
    },
    {
      title: t('experience.items.projectEngineer.title'),
      company: t('experience.items.projectEngineer.company'),
      period: '2018-2022',
      tasks: [
        t('experience.items.projectEngineer.tasks.0'),
        t('experience.items.projectEngineer.tasks.1')
      ],
      skills: ['Python', 'Selenium']
    },
    {
      title: t('experience.items.dataEngineer.title'),
      company: t('experience.items.dataEngineer.company'),
      period: '2021-2022',
      tasks: [
        t('experience.items.dataEngineer.tasks.0'),
        t('experience.items.dataEngineer.tasks.1')
      ],
      skills: ['AWS', 'Python', 'ML']
    },
    {
      title: t('experience.items.founder.title'),
      company: t('experience.items.founder.company'),
      period: '2021-2024',
      tasks: [
        t('experience.items.founder.tasks.0')
      ],
      skills: ['AI/ML', 'Web Dev']
    }
  ];
  
  return (
    <section id="experience" className="py-20 bg-cyber-dark" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-orbitron text-4xl font-bold text-white inline-block relative">
            <span className="relative z-10">{t('experience.title')}</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-cyber-teal"></span>
          </h2>
          <p className="text-cyber-light mt-4 max-w-2xl mx-auto">
            {t('experience.subtitle')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              className="flex mb-12"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline Dot and Line */}
              <div className="flex flex-col items-center mr-4">
                <div className="timeline-dot"></div>
                {index < experiences.length - 1 && <div className="timeline-line h-full flex-grow"></div>}
              </div>
              
              {/* Content */}
              <div className="cyber-border rounded-lg p-6 glass-card flex-1 transform hover:translate-x-2 transition duration-300 hover:box-glow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h3 className="font-orbitron text-cyber-teal text-xl">{exp.title}</h3>
                    <p className="text-white mt-1">{exp.company}</p>
                    <div className="mt-4 space-y-2">
                      {exp.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start">
                          <ChevronRight className="text-cyber-yellow mt-1 mr-2 h-4 w-4" />
                          <p className="text-cyber-light text-sm">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <span className="inline-block bg-cyber-purple/20 text-cyber-purple px-3 py-1 rounded-full text-sm font-orbitron">
                      {exp.period}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2 md:justify-end">
                      {exp.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-cyber-gray px-2 py-1 rounded text-xs">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CV Download Button */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            variant="outline"
            className="inline-flex items-center border-2 border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-cyber-dark font-orbitron px-6 py-6 rounded-lg transition duration-300 uppercase tracking-wider text-sm"
            onClick={() => window.open('/CV-Rodolfo-Sepulveda.pdf', '_blank')}
          >
            <FileText className="mr-2 h-4 w-4" />
            {t('experience.viewResume')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
