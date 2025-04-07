import { useLanguage } from '@/hooks/useLanguage';
import TimelineItem from '@/components/ui/TimelineItem';
import { experiences } from '@/data';
import { motion } from 'framer-motion';

const Experience = () => {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <section id="experience" className="py-20 bg-[#2A2A2A]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4">
            {t('experience.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00FFC8] to-[#FF9500] mx-auto"></div>
        </motion.div>
        
        <div className="timeline-container px-4">
          <div className="timeline-line"></div>
          
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {experiences.map((experience) => (
              <motion.div key={experience.id} variants={item}>
                <TimelineItem experience={experience} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
