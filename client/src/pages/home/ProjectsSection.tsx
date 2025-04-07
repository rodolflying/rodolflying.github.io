import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const projects = [
    {
      title: t('projects.items.dataplatform.title'),
      description: t('projects.items.dataplatform.description'),
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80',
      category: t('projects.items.dataplatform.category'),
      skills: ['AWS', 'Python', 'API Integration']
    },
    {
      title: t('projects.items.automation.title'),
      description: t('projects.items.automation.description'),
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80',
      category: t('projects.items.automation.category'),
      skills: ['Python', 'Selenium', 'Process Automation']
    },
    {
      title: t('projects.items.nlp.title'),
      description: t('projects.items.nlp.description'),
      image: 'https://images.unsplash.com/photo-1542903660-eedba2cda473?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80',
      category: t('projects.items.nlp.category'),
      skills: ['Python', 'NLP', 'Machine Learning']
    }
  ];

  return (
    <section id="projects" className="py-20 bg-cyber-dark relative overflow-hidden" ref={sectionRef}>
      {/* Background tech pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&h=1080&q=80')] bg-cover bg-center" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-orbitron text-4xl font-bold text-white inline-block relative">
            <span className="relative z-10">{t('projects.title')}</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-cyber-teal"></span>
          </h2>
          <p className="text-cyber-light mt-4 max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              className="cyber-border rounded-lg overflow-hidden hover:box-glow transition duration-300 transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-gray to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="bg-cyber-teal/80 text-cyber-dark px-2 py-1 rounded text-xs font-orbitron">{project.category}</span>
                </div>
              </div>
              <div className="p-6 glass-card">
                <h3 className="font-orbitron text-white text-xl mb-2">{project.title}</h3>
                <p className="text-cyber-light text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="bg-cyber-gray/50 px-2 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
                <button className="inline-flex items-center text-cyber-teal hover:text-cyber-yellow transition duration-300 text-sm font-orbitron">
                  <ArrowRight className="mr-1 h-4 w-4" /> {t('projects.viewDetails')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            variant="outline"
            className="inline-flex items-center border-2 border-cyber-teal text-cyber-teal hover:bg-cyber-teal hover:text-cyber-dark font-orbitron px-6 py-6 rounded-lg transition duration-300 uppercase tracking-wider text-sm"
          >
            <Folder className="mr-2 h-4 w-4" /> {t('projects.viewAll')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
