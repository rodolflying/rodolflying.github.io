import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onShowDetails: (project: Project) => void;
}

const ProjectCard = ({ project, onShowDetails }: ProjectCardProps) => {
  const { language } = useLanguage();
  const { title, description, category, technologies, image, color } = project;

  return (
    <div 
      className="cyberpunk-border bg-[#1E1E1E] rounded-lg overflow-hidden group transition duration-300"
      style={{ borderColor: `${color}33`, boxShadow: `0 0 20px ${color}10` }}
    >
      <div className="h-48 bg-[#2A2A2A] overflow-hidden relative">
        <img 
          src={image}
          alt={title[language]} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-70"></div>
        <div 
          className="absolute top-4 right-4 px-3 py-1 text-[#121212] rounded-full text-xs font-semibold"
          style={{ backgroundColor: color }}
        >
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-['Orbitron'] mb-3"
          style={{ color: color }}
        >
          {title[language]}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-2">
          {description[language]}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.slice(0, 4).map((tech, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-[#121212] text-xs rounded text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
        <button 
          onClick={() => onShowDetails(project)}
          className="mt-2 px-4 py-2 w-full bg-transparent border rounded transition duration-300"
          style={{ borderColor: color, color: color }}
        >
          {language === 'en' ? 'View Details' : 'Ver Detalles'}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
