import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Project } from '@/types';
import { X } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const { language } = useLanguage();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('project-modal');
      if (modal && e.target === modal) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <div 
      id="project-modal"
      className={`fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}
    >
      <div className="bg-[#1E1E1E] w-full max-w-4xl mx-4 rounded-lg overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="h-64 md:h-80 bg-[#2A2A2A] relative overflow-hidden">
          <img 
            src={project.image}
            alt={project.title[language]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-70"></div>
          <div 
            className="absolute top-6 right-6 px-4 py-2 text-[#121212] rounded-full text-sm font-semibold"
            style={{ backgroundColor: project.color }}
          >
            {project.category}
          </div>
        </div>
        
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h3 
              className="text-2xl font-['Orbitron']"
              style={{ color: project.color }}
            >
              {project.title[language]}
            </h3>
            
            {project.link && (
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: project.color, color: '#121212' }}
              >
                <span>{language === 'en' ? 'Visit Website' : 'Visitar Sitio Web'}</span>
                <span className="text-lg">↗</span>
              </a>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h4 className="text-xl font-['Orbitron'] text-gray-200 mb-4">
                {language === 'en' ? 'Project Overview' : 'Descripción del Proyecto'}
              </h4>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {project.description[language]}
              </p>
              
              <h4 className="text-xl font-['Orbitron'] text-gray-200 mb-4">
                {language === 'en' ? 'Key Features' : 'Características Principales'}
              </h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                {project.features[language].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-['Orbitron'] text-gray-200 mb-4">
                {language === 'en' ? 'Technologies' : 'Tecnologías'}
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-[#121212] text-sm rounded text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <h4 className="text-xl font-['Orbitron'] text-gray-200 mb-4">
                {language === 'en' ? 'Results' : 'Resultados'}
              </h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {project.results[language].map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
