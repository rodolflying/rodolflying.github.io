import { useLanguage } from '@/hooks/useLanguage';
import { Skill } from '@/types';
import { 
  Code,
  Layers,
  Cloud, 
  Brain, 
  BarChart, 
  Plug
} from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
}

const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'code':
      return <Code className={`text-[${iconName}-color] text-2xl`} />;
    case 'layers':
      return <Layers className={`text-[${iconName}-color] text-2xl`} />;
    case 'cloud':
      return <Cloud className={`text-[${iconName}-color] text-2xl`} />;
    case 'brain':
      return <Brain className={`text-[${iconName}-color] text-2xl`} />;
    case 'chart':
      return <BarChart className={`text-[${iconName}-color] text-2xl`} />;
    case 'plug':
      return <Plug className={`text-[${iconName}-color] text-2xl`} />;
    default:
      return <Code className={`text-[${iconName}-color] text-2xl`} />;
  }
};

const SkillCard = ({ skill }: SkillCardProps) => {
  const { language } = useLanguage();
  const { category, icon, items, color } = skill;

  return (
    <div className="cyberpunk-border bg-[#1E1E1E] p-6 rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00FFC8]/20">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg bg-[${color}]/20 flex items-center justify-center mr-4`}>
          {getIconComponent(icon)}
        </div>
        <h3 className="text-xl font-['Orbitron'] text-white">
          {category[language]}
        </h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <span 
            key={index} 
            className={`px-3 py-1 bg-[#121212] rounded-full text-[${color}] border border-[${color}]/30`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
