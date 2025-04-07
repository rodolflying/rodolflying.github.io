import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { Cpu, Globe, Server, Database, BookOpen, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface ServiceItem {
  id: string;
  icon: ReactNode;
  title: string;
  color: string;
}

const Services = () => {
  const { t, language } = useLanguage();
  
  // Animation variants for framer motion
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

  // Hardcoded service items for each language since the i18n system isn't returning arrays properly
  const serviceItemsContent = {
    automation: {
      en: [
        'Python scripts for repetitive tasks',
        'Intuitive desktop interfaces for scripts',
        'Excel process automation'
      ],
      es: [
        'Scripts en Python para tareas repetitivas',
        'Interfaces de escritorio intuitivas para scripts',
        'Automatización de procesos en Excel'
      ]
    },
    webdev: {
      en: [
        'Modern and 100% responsive landing pages',
        'Dynamic websites with databases (SQL / NoSQL)',
        'User management, authentication and dashboards',
        'WebPay payment integration'
      ],
      es: [
        'Landing pages modernas y 100% responsive',
        'Sitios web dinámicos con bases de datos (SQL / NoSQL)',
        'Gestión de usuarios, autenticación y dashboards',
        'Integración de pagos WebPay'
      ]
    },
    backend: {
      en: [
        'Robust API development in Python and Node.js',
        'External API consumption (REST / GraphQL)',
        'Flexible infrastructure on AWS and Google Cloud (GCP)'
      ],
      es: [
        'Desarrollo robusto de APIs en Python y Node.js',
        'Consumo de APIs externas (REST / GraphQL)',
        'Infraestructura flexible en AWS y Google Cloud (GCP)'
      ]
    },
    webscraping: {
      en: [
        'Data extraction from websites',
        'Data transformation and loading (ETL)',
        'Scalable automations with tracking'
      ],
      es: [
        'Extracción de datos de sitios web',
        'Transformación y carga de datos (ETL)',
        'Automatizaciones escalables con seguimiento'
      ]
    },
    consulting: {
      en: [
        '1-on-1 or group programming classes',
        'Support with real projects and portfolios',
        'Code review and improvement'
      ],
      es: [
        'Clases de programación 1 a 1 o grupales',
        'Apoyo con proyectos reales y portfolio',
        'Revisión y mejora de código'
      ]
    }
  };
  
  // Service categories with their corresponding icons
  const services: ServiceItem[] = [
    {
      id: 'automation',
      icon: <Cpu className="w-10 h-10 text-[#00FFC8]" />,
      title: t('services.automation.title'),
      color: '#00FFC8'
    },
    {
      id: 'webdev',
      icon: <Globe className="w-10 h-10 text-[#FF9500]" />,
      title: t('services.webdev.title'),
      color: '#FF9500'
    },
    {
      id: 'backend',
      icon: <Server className="w-10 h-10 text-[#6B38FB]" />,
      title: t('services.backend.title'),
      color: '#6B38FB'
    },
    {
      id: 'webscraping',
      icon: <Database className="w-10 h-10 text-[#FF2D55]" />,
      title: t('services.webscraping.title'),
      color: '#FF2D55'
    },
    {
      id: 'consulting',
      icon: <BookOpen className="w-10 h-10 text-[#00FFC8]" />,
      title: t('services.consulting.title'),
      color: '#00FFC8'
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#1E1E1E]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white mb-4">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00FFC8] to-[#FF9500] mx-auto"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            // Get items directly from our hardcoded content based on the current language
            const serviceItems = serviceItemsContent[service.id as keyof typeof serviceItemsContent][language];
            
            return (
              <motion.div 
                key={service.id} 
                variants={item}
                className="relative overflow-hidden rounded-lg cyberpunk-border p-6 bg-[#2A2A2A] hover:shadow-lg transition-all duration-300"
                style={{ 
                  boxShadow: `0 0 0 1px ${service.color}20`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="mb-6 flex items-center">
                  {service.icon}
                  <h3 className="text-xl font-['Orbitron'] font-bold ml-3" style={{ color: service.color }}>
                    {service.title}
                  </h3>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {serviceItems.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="flex-shrink-0 w-5 h-5 mt-0.5" style={{ color: service.color }} />
                      <span className="ml-2 text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div 
                  className="absolute bottom-0 left-0 w-full h-1"
                  style={{ backgroundColor: service.color }}
                ></div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;