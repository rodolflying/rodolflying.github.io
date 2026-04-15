import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import ProjectCard from '@/components/ui/ProjectCard';
import ProjectModal from '@/components/ui/ProjectModal';
import { projects } from '@/data';
import { Project } from '@/types';
import { motion } from 'framer-motion';

const Projects = () => {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const categoryOrder = [
    'Web Development',
    'Automation',
    'AI Development',
    'Data Engineering',
    'Data Science',
    'Process Optimization'
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6B38FB] to-[#FF9500] mx-auto"></div>
        </motion.div>
        
        {categoryOrder.map((category) => {
          const categoryProjects = projects.filter(p => p.category === category);
          if (categoryProjects.length === 0) return null;
          
          return (
            <div key={category} className="mb-20 last:mb-0">
              <motion.h3 
                className="text-2xl font-bold font-['Orbitron'] text-gray-200 mb-8 border-l-4 border-[#00FFC8] pl-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {category}
              </motion.h3>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {categoryProjects.map((project) => (
                  <motion.div key={project.id} variants={item}>
                    <ProjectCard 
                      project={project} 
                      onShowDetails={handleShowDetails} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default Projects;
