import { useLanguage } from '@/hooks/useLanguage';
import { Experience } from '@/types';

interface TimelineItemProps {
  experience: Experience;
}

const TimelineItem = ({ experience }: TimelineItemProps) => {
  const { language } = useLanguage();
  const { role, company, period, description, skills, color } = experience;

  return (
    <div className="relative pl-8 pb-12">
      <div 
        className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center z-10"
        style={{ backgroundColor: color }}
      >
        <div className="w-4 h-4 bg-[#121212] rounded-full"></div>
      </div>
      
      <div 
        className="cyberpunk-border bg-[#1E1E1E] p-6 rounded-lg ml-4 transition-shadow duration-300"
        style={{ borderColor: `${color}33` }}
      >
        <div className="flex flex-wrap justify-between items-start mb-4">
          <h3 
            className="text-xl font-['Orbitron'] font-bold"
            style={{ color: color }}
          >
            {role[language]}
          </h3>
          <div 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${color}1A`, color: color }}
          >
            {period}
          </div>
        </div>
        <p className="text-gray-400 mb-2">{company}</p>
        <ul className="list-disc ml-5 text-gray-300 space-y-2 mt-4">
          {description[language].map((item, index) => (
            <li key={index} className="pl-1">{item}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-[#121212] text-xs rounded text-gray-400"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
