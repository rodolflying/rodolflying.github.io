import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Terminal, 
  GraduationCap, 
  Globe2, 
  Code2, 
  Server, 
  Database, 
  Cpu, 
  LineChart 
} from 'lucide-react';

interface SkillDialProps {
  name: string;
  percentage: number;
  color: string;
  tools: string[];
}

const SkillDial = ({ name, percentage, color, tools }: SkillDialProps) => {
  const [hovered, setHovered] = useState(false);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      className="relative flex flex-col items-center p-3 bg-gray-950/40 border border-gray-850 hover:border-gray-700 rounded-xl transition-all duration-300 shadow-inner group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-20 h-20 flex items-center justify-center cursor-pointer">
        {/* Background track circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle 
            cx="40" 
            cy="40" 
            r={radius} 
            stroke="rgba(255,255,255,0.02)" 
            strokeWidth="5" 
            fill="transparent" 
          />
          {/* Animated progress circle */}
          <motion.circle 
            cx="40" 
            cy="40" 
            r={radius} 
            stroke={color} 
            strokeWidth="5" 
            fill="transparent" 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${color}30)` }}
          />
        </svg>
        <span className="absolute text-xs font-bold font-['Orbitron'] text-white">
          {percentage}%
        </span>
      </div>
      <h4 className="mt-2 font-['Orbitron'] font-bold text-[10px] text-gray-400 group-hover:text-white transition-colors tracking-wider">
        {name}
      </h4>

      {/* Floating details tag cloud tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            className="absolute z-20 bottom-full mb-2 bg-[#181818]/95 border border-gray-800 rounded-lg p-2.5 shadow-2xl backdrop-blur-md w-[160px] text-center pointer-events-none"
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <span className="block text-[8px] font-['Orbitron'] font-bold text-[#00FFC8] uppercase tracking-wider mb-1.5">Tecnologías</span>
            <div className="flex flex-wrap gap-1 justify-center">
              {tools.map((tool, i) => (
                <span key={i} className="text-[8px] font-sans font-medium px-1 py-0.5 rounded bg-black/60 border border-gray-850 text-gray-300">
                  {tool}
                </span>
              ))}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#181818] border-r border-b border-gray-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const About = () => {
  const { language, t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const skillDials: SkillDialProps[] = [
    { name: 'Python', percentage: 95, color: '#00FFC8', tools: ['Selenium', 'Pandas', 'Flask', 'Numpy', 'Scikit-learn', 'Pytest'] },
    { name: 'SQL', percentage: 90, color: '#6B38FB', tools: ['PostgreSQL', 'Oracle', 'Redshift', 'Complex Queries', 'Drizzle'] },
    { name: 'JavaScript', percentage: 85, color: '#FF2D55', tools: ['NodeJS', 'TypeScript', 'ESM / ESM Config', 'ExpressJS'] },
    { name: 'React', percentage: 80, color: '#FF9500', tools: ['Vite', 'Framer Motion', 'Tailwind CSS', 'Wouter Router'] },
    { name: 'AWS Cloud', percentage: 85, color: '#00FFC8', tools: ['Lambda', 'Pinpoint', 'S3', 'API Gateway', 'CloudWatch'] },
    { name: 'Data & ML', percentage: 88, color: '#6B38FB', tools: ['NLP Models', 'LLM Prompting', 'Clustering', 'Predictive Analysis'] }
  ];

  return (
    <section id="about" className="py-20 bg-[#121212] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#151515] to-[#0c0c0c] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4 uppercase tracking-wider">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00FFC8] to-[#6B38FB] mx-auto"></div>
        </motion.div>
        
        {/* Profile Card & Skill Dials Layout */}
        <motion.div 
          className="grid lg:grid-cols-12 gap-8 items-stretch"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          
          {/* Left Side: high tech ID Card & Bio (5 columns span) */}
          <motion.div 
            className="lg:col-span-5 flex flex-col space-y-6"
            variants={item}
          >
            {/* Cybernetic Security Badge Mockup */}
            <div className="relative p-5 rounded-xl border border-gray-800 bg-[#181818]/80 backdrop-blur-md overflow-hidden shadow-2xl">
              
              {/* Badge visual elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00FFC8]/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-4 right-4 flex space-x-1 opacity-20 pointer-events-none">
                <div className="w-1.5 h-8 bg-gray-500 rounded" />
                <div className="w-1.5 h-6 bg-gray-500 rounded mt-2" />
                <div className="w-1.5 h-4 bg-gray-500 rounded mt-4" />
              </div>

              {/* Status Header */}
              <div className="flex justify-between items-center border-b border-gray-850 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FFC8] animate-pulse shadow-[0_0_8px_#00FFC8]" />
                  <span className="font-['Orbitron'] text-[9px] text-[#00FFC8] font-bold tracking-widest">STAR_SYSTEMS_ACTIVE</span>
                </div>
                <Shield className="w-4 h-4 text-gray-500" />
              </div>

              {/* CEO profile summary */}
              <div className="flex items-center space-x-4 mb-4">
                {/* SVG Tech Wireframe placeholder avatar */}
                <div className="w-16 h-16 rounded-lg border border-gray-800 bg-gray-950 flex items-center justify-center relative overflow-hidden shadow-inner flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00FFC8]/10 via-transparent to-transparent" />
                  <Terminal className="w-8 h-8 text-[#00FFC8] opacity-75" />
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-[#00FFC8] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-['Orbitron'] font-bold text-sm text-white tracking-wide">RODOLFO SEPÚLVEDA</h4>
                  <p className="text-[10px] text-gray-400 font-medium font-sans uppercase tracking-wider">{t('about.profile')}</p>
                  <p className="text-[8px] text-gray-500 font-mono mt-0.5">ID: SA_CEO_2026</p>
                </div>
              </div>

              {/* Biography paragraph content */}
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed border-t border-gray-850 pt-4 mt-2">
                {t('about.profile_text')}
              </p>
            </div>
            
            {/* Education details cards */}
            <div className="p-5 rounded-xl border border-gray-850 bg-[#181818]/60 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-['Orbitron'] font-bold text-[#FF9500] mb-4 flex items-center uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {t('about.education')}
                </h3>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-start">
                    <div className="text-[#FF9500] mr-2.5 mt-0.5 font-bold">•</div>
                    <div>
                      <h4 className="font-semibold text-xs text-white">
                        {t('about.education1_title')}
                      </h4>
                      <p className="text-gray-400 text-[10px] mt-0.5">Universidad Católica del Norte, Chile</p>
                      <span className="text-gray-500 text-[9px] font-mono">2012 - 2018</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#FF9500] mr-2.5 mt-0.5 font-bold">•</div>
                    <div>
                      <h4 className="font-semibold text-xs text-white">
                        {t('about.education2_title')}
                      </h4>
                      <p className="text-gray-400 text-[10px] mt-0.5">Universidad de Cádiz, España</p>
                      <span className="text-gray-500 text-[9px] font-mono">2017 - 2018</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Side: Skill Dials & Languages (7 columns span) */}
          <motion.div 
            className="lg:col-span-7 flex flex-col space-y-6"
            variants={item}
          >
            {/* Skill Dials panel */}
            <div className="p-5 rounded-xl border border-gray-850 bg-[#181818]/80 backdrop-blur-md flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-['Orbitron'] font-bold text-[#6B38FB] mb-4 flex items-center uppercase tracking-wider border-b border-gray-850 pb-2">
                  <Code2 className="w-4 h-4 mr-2" />
                  {t('about.skills')}
                </h3>
                <p className="text-[10px] text-gray-500 mb-6 font-sans">
                  {language === 'es' 
                    ? 'Pasa el cursor sobre cada indicador circular para revelar los frameworks, librerías y tecnologías específicas.'
                    : 'Hover over each dial indicator to reveal specific frameworks, libraries, and technologies.'}
                </p>
                
                {/* Dial Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {skillDials.map((skill, index) => (
                    <SkillDial 
                      key={index}
                      name={skill.name}
                      percentage={skill.percentage}
                      color={skill.color}
                      tools={skill.tools}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Languages panel */}
            <div className="p-5 rounded-xl border border-gray-850 bg-[#181818]/60">
              <h3 className="text-xs font-['Orbitron'] font-bold text-[#6B38FB] mb-4 flex items-center uppercase tracking-wider">
                <Globe2 className="w-4 h-4 mr-2" />
                {t('about.languages')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Spanish */}
                <div className="p-3 bg-gray-950/45 rounded-lg border border-gray-850 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-white tracking-wide uppercase font-['Orbitron']">
                      {t('about.spanish')}
                    </p>
                    <span className="text-[9px] text-gray-500">Nativo / Lengua Materna</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#00FFC8] shadow-[0_0_4px_#00FFC8]" />
                    ))}
                  </div>
                </div>

                {/* English */}
                <div className="p-3 bg-gray-950/45 rounded-lg border border-gray-850 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-white tracking-wide uppercase font-['Orbitron']">
                      {t('about.english')}
                    </p>
                    <span className="text-[9px] text-gray-500 font-medium">B2 / Profesional Avanzado</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#00FFC8] shadow-[0_0_4px_#00FFC8]" />
                    ))}
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-[#00FFC8]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;
