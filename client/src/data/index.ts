import { Experience, Project, Skill } from '@/types';

export const skills: Skill[] = [
  {
    id: 1,
    category: {
      en: 'Programming Languages',
      es: 'Lenguajes de Programación',
    },
    icon: 'code',
    items: ['Python', 'JavaScript', 'SQL', 'R', 'Java', 'Visual Basic'],
    color: '#00FFC8',
  },
  {
    id: 2,
    category: {
      en: 'Frameworks & Libraries',
      es: 'Frameworks y Librerías',
    },
    icon: 'layers',
    items: ['React', 'Node.js', 'Flask', 'Selenium', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Anaconda', 'Seaborn'],
    color: '#FF2D55',
  },
  {
    id: 3,
    category: {
      en: 'Cloud & Infrastructure',
      es: 'Nube e Infraestructura',
    },
    icon: 'cloud',
    items: ['AWS', 'GCP', 'Docker', 'Git', 'Linux', 'Jenkins', 'Postman'],
    color: '#FF9500',
  },
  {
    id: 4,
    category: {
      en: 'Data Science & ML',
      es: 'Ciencia de Datos & ML',
    },
    icon: 'brain',
    items: ['NLP', 'Computer Vision', 'LLM', 'Clustering', 'Regression', 'Classification', 'Statistics'],
    color: '#6B38FB',
  },
  {
    id: 5,
    category: {
      en: 'Business Tools',
      es: 'Herramientas de Negocio',
    },
    icon: 'chart',
    items: ['Power BI', 'Excel', 'Tableau', 'Quicksight', 'Project', 'Simio', 'Minitab'],
    color: '#00FFC8',
  },
  {
    id: 6,
    category: {
      en: 'API Services',
      es: 'Servicios API',
    },
    icon: 'plug',
    items: ['AWS Pinpoint', 'Piano Composer', 'ChatGPT API', 'REST', 'GraphQL', 'Web Scraping'],
    color: '#FF2D55',
  },
];

export const experiences: Experience[] = [
  {
    id: 1,
    role: {
      en: 'Data Scientist',
      es: 'Data Scientist',
    },
    company: 'Grupo Copesa, La Tercera',
    period: '2022 - 2024',
    description: {
      en: [
        'Automated the sending of 15 newsletters to over 1 million recipients using AWS Pinpoint',
        'Designed and automated reports (Power BI/Quicksight) on key metrics: most viewed/commented news, survey results (Alchemer), and newsletter performance',
        'Implemented advertising targeting and personalized content for LaTercera users via Piano Composer API, utilizing First Party Data',
        'Participated in the restructuring and optimization of audience databases for the creation of a Customer Data Platform',
      ],
      es: [
        'Automaticé el envío de 15 newsletters a más de 1 millón de destinatarios utilizando AWS Pinpoint',
        'Diseñé y automaticé reportes (Power BI/Quicksight) sobre métricas clave: noticias más vistas/comentadas, encuestas (Alchemer) y rendimiento de newsletters',
        'Implementé targeting publicitario y contenido personalizado para usuarios de La Tercera vía Piano Composer API, utilizando First Party Data',
        'Participé en la reestructuración y optimización de BBDD del área de audiencias para la creación de un Customer Data Platform',
      ],
    },
    skills: ['AWS', 'Power BI', 'Python', 'API Integration', 'Data Analytics'],
    color: '#00FFC8',
  },
  {
    id: 2,
    role: {
      en: 'Project & Development Engineer',
      es: 'Ingeniero de Proyectos y Desarrollo',
    },
    company: 'Consorcio Heuma, Universidad Católica del Norte',
    period: '2018 - 2022',
    description: {
      en: [
        'Automated the financial reporting process for ~1500 files/forms on the SGP platform using Python Selenium',
        'Developed an interface to automate purchasing, banking, and financial process management',
        'Managed, monitored, and reported on CLP 2.19 MM for the CORFO project \"Engineering 2030\" (16ENI2-71940)',
      ],
      es: [
        'Automaticé el proceso de rendición financiera de ~1500 archivos/formularios en la plataforma SGP con Python Selenium',
        'Desarrollé una interfaz para automatizar gestiones de los procesos de compras, bancario y financiero',
        'Gestioné, monitoricé y rendí $2.19 MM del proyecto CORFO \"Ingeniería 2030\" (16ENI2-71940)',
      ],
    },
    skills: ['Python', 'Selenium', 'Project Management', 'Financial Reporting', 'Automation'],
    color: '#FF2D55',
  },
  {
    id: 3,
    role: {
      en: 'Data Engineer',
      es: 'Ingeniero de Datos',
    },
    company: 'Rebaño Consultores',
    period: '2021 - 2022',
    description: {
      en: [
        'Created and cleaned a database with ~2 million records on AWS',
        'Collaborated in the data analysis process using AI and ML for NLP, achieving a 700% improvement compared to the manual process',
        'Programmed interfaces and scripts for automated data downloading from various social networks, resulting in a 500% increase in data collection efficiency',
      ],
      es: [
        'Creé y depuré una BBDD con ~2 millones de registros en AWS',
        'Colaboré en el proceso de análisis de datos mediante uso de IA, ML para NLP. Mejora del 700% respecto al proceso manual',
        'Programé interfaces (Python) y scripts para la descarga automatizada de datos desde diversas redes sociales, resultando en un aumento de 500% en la eficiencia de recolección de datos',
      ],
    },
    skills: ['AWS', 'Python', 'NLP', 'Web Scraping', 'Data Cleaning'],
    color: '#6B38FB',
  },
  {
    id: 4,
    role: {
      en: 'Founder and Partner',
      es: 'Fundador y Socio',
    },
    company: 'Star Apps SpA',
    period: '2021 - Present',
    description: {
      en: [
        'Co-founded a start-up focused on developing applications and IT solutions applying ML and AI',
        'Developed custom web and mobile solutions for businesses in various industries',
        'Implemented AI-driven analytical tools for business intelligence and data-driven decision making',
      ],
      es: [
        'Cofundador de start-up enfocada en desarrollar aplicaciones y soluciones informáticas aplicando ML e IA',
        'Desarrollo de soluciones web y móviles personalizadas para empresas en diversas industrias',
        'Implementación de herramientas analíticas basadas en IA para inteligencia empresarial y toma de decisiones basadas en datos',
      ],
    },
    skills: ['Entrepreneurship', 'React', 'Node.js', 'AI/ML', 'Business Development'],
    color: '#FF9500',
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: {
      en: 'Newsletter Automation Platform',
      es: 'Plataforma de Automatización de Newsletter',
    },
    description: {
      en: 'AWS-based system that automated newsletter delivery to 1M+ recipients with personalization features and analytics',
      es: 'Sistema basado en AWS que automatizó la entrega de newsletters a más de 1M de destinatarios con funciones de personalización y análisis',
    },
    category: 'Data Engineering',
    technologies: ['AWS Pinpoint', 'Python', 'Power BI', 'AWS Lambda', 'AWS S3', 'API Integration', 'HTML/CSS'],
    features: {
      en: [
        'Automated newsletter scheduling and delivery system',
        'Personalized content based on user preferences and behavior',
        'Comprehensive analytics dashboard with custom reports',
        'A/B testing functionality for optimization',
        'Integration with existing customer database systems',
      ],
      es: [
        'Sistema automatizado de programación y envío de newsletters',
        'Contenido personalizado basado en preferencias y comportamiento del usuario',
        'Panel de análisis completo con informes personalizados',
        'Funcionalidad de pruebas A/B para optimización',
        'Integración con sistemas de bases de datos de clientes existentes',
      ],
    },
    results: {
      en: [
        '45% increase in newsletter open rates',
        '60% reduction in manual marketing workload',
        'Enhanced data collection and user insights',
        'Improved content personalization capabilities',
      ],
      es: [
        '45% de aumento en las tasas de apertura de newsletters',
        '60% de reducción en la carga de trabajo manual de marketing',
        'Mejora en la recopilación de datos y conocimientos del usuario',
        'Capacidades mejoradas de personalización de contenido',
      ],
    },
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#00FFC8',
  },
  {
    id: 2,
    title: {
      en: 'Customer Data Platform',
      es: 'Plataforma de Datos de Cliente',
    },
    description: {
      en: 'Restructuring of audience databases and implementation of a CDP for advanced user segmentation and targeted content',
      es: 'Reestructuración de bases de datos de audiencias e implementación de un CDP para segmentación avanzada de usuarios y contenido dirigido',
    },
    category: 'Data Science',
    technologies: ['First Party Data', 'SQL', 'Piano Composer', 'Segmentation', 'AWS Redshift', 'Python', 'API'],
    features: {
      en: [
        'Unified customer data from multiple sources',
        'Real-time segmentation engine',
        'Personalized content delivery system',
        'Integration with advertising platforms',
        'Compliance with privacy regulations',
      ],
      es: [
        'Datos de clientes unificados de múltiples fuentes',
        'Motor de segmentación en tiempo real',
        'Sistema de entrega de contenido personalizado',
        'Integración con plataformas publicitarias',
        'Cumplimiento de normativas de privacidad',
      ],
    },
    results: {
      en: [
        '35% increase in advertising effectiveness',
        'More accurate user segmentation',
        '50% improvement in targeting precision',
        'Enhanced content personalization',
      ],
      es: [
        '35% de aumento en la efectividad publicitaria',
        'Mayor precisión en la segmentación de usuarios',
        '50% de mejora en la precisión de segmentación',
        'Personalización de contenido mejorada',
      ],
    },
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF2D55',
  },
  {
    id: 3,
    title: {
      en: 'Financial Process Automation',
      es: 'Automatización de Procesos Financieros',
    },
    description: {
      en: 'Python-Selenium solution for automating financial reporting processes for 1500+ documents, improving efficiency by 80%',
      es: 'Solución Python-Selenium para automatizar procesos de rendición financiera de más de 1500 documentos, mejorando la eficiencia en un 80%',
    },
    category: 'Automation',
    technologies: ['Python', 'Selenium', 'Web Automation', 'Finance', 'Reporting', 'Data Extraction'],
    features: {
      en: [
        'Automated form filling and submission',
        'Document classification and processing',
        'Error detection and handling',
        'Financial data validation',
        'Comprehensive reporting dashboard',
      ],
      es: [
        'Llenado y envío automatizado de formularios',
        'Clasificación y procesamiento de documentos',
        'Detección y manejo de errores',
        'Validación de datos financieros',
        'Panel de informes completo',
      ],
    },
    results: {
      en: [
        '80% efficiency improvement in financial reporting',
        '95% reduction in manual data entry errors',
        'Reduced reporting time from weeks to hours',
        'Standardized reporting across departments',
      ],
      es: [
        '80% de mejora de eficiencia en informes financieros',
        '95% de reducción en errores de ingreso manual de datos',
        'Tiempo de informes reducido de semanas a horas',
        'Informes estandarizados en todos los departamentos',
      ],
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#6B38FB',
  },
  {
    id: 4,
    title: {
      en: 'Social Data Collection System',
      es: 'Sistema de Recolección de Datos Sociales',
    },
    description: {
      en: 'Automated data collection system from social networks with NLP processing, increasing efficiency by 500%',
      es: 'Sistema automatizado de recolección de datos desde redes sociales con procesamiento NLP, aumentando la eficiencia en un 500%',
    },
    category: 'Data Engineering',
    technologies: ['Python', 'APIs', 'NLP', 'ML', 'Data Collection', 'Social Media Analytics'],
    features: {
      en: [
        'Automated social media data collection',
        'Multi-platform support (Twitter, Facebook, Instagram)',
        'Sentiment analysis with NLP',
        'Topic modeling and trend detection',
        'Custom reporting and visualization',
      ],
      es: [
        'Recopilación automatizada de datos de redes sociales',
        'Soporte multiplataforma (Twitter, Facebook, Instagram)',
        'Análisis de sentimiento con PNL',
        'Modelado de temas y detección de tendencias',
        'Informes personalizados y visualización',
      ],
    },
    results: {
      en: [
        '500% increase in data collection efficiency',
        'Real-time social media insights',
        'Improved brand sentiment tracking',
        'Enhanced competitive intelligence',
      ],
      es: [
        '500% de aumento en la eficiencia de recolección de datos',
        'Información en tiempo real de redes sociales',
        'Mejora en el seguimiento del sentimiento de marca',
        'Inteligencia competitiva mejorada',
      ],
    },
    image: 'https://images.unsplash.com/photo-1605004781326-7175b71ea82e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF9500',
  },
  {
    id: 5,
    title: {
      en: 'Civil Registry Optimization',
      es: 'Optimización de Registro Civil',
    },
    description: {
      en: 'Queue simulation system that optimized waiting times by 20% and streamlined document registration process',
      es: 'Sistema de simulación de colas que optimizó tiempos de espera en un 20% y agilizó el proceso de registro de documentos',
    },
    category: 'Process Optimization',
    technologies: ['Queue Simulation', 'Process Design', 'UX Design', 'Public Service', 'Process Optimization'],
    features: {
      en: [
        'Queue simulation and optimization',
        'Staff allocation based on demand prediction',
        'User-friendly document preparation guidance',
        'Service time reduction through process redesign',
        'Real-time monitoring dashboard',
      ],
      es: [
        'Simulación y optimización de colas',
        'Asignación de personal basada en predicción de demanda',
        'Guía de preparación de documentos fácil de usar',
        'Reducción del tiempo de servicio mediante rediseño de procesos',
        'Panel de monitoreo en tiempo real',
      ],
    },
    results: {
      en: [
        '20% reduction in waiting times',
        'Improved user satisfaction scores',
        'Optimized resource allocation',
        'Streamlined document processing workflow',
      ],
      es: [
        '20% de reducción en tiempos de espera',
        'Mejora en los puntajes de satisfacción del usuario',
        'Asignación optimizada de recursos',
        'Flujo de trabajo de procesamiento de documentos simplificado',
      ],
    },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#00FFC8',
  },
  {
    id: 6,
    title: {
      en: 'Star Apps AI Assistant',
      es: 'Asistente IA de Star Apps',
    },
    description: {
      en: 'AI-powered virtual assistant for business process automation and customer service integration',
      es: 'Asistente virtual con IA para automatización de procesos empresariales e integración de servicio al cliente',
    },
    category: 'AI Development',
    technologies: ['LLM', 'React', 'Node.js', 'ChatGPT API', 'Customer Service', 'Process Automation'],
    features: {
      en: [
        'Natural language understanding and processing',
        'Integration with business systems and workflows',
        'Multi-channel support (chat, email, voice)',
        'Learning capabilities from user interactions',
        'Custom business logic implementation',
      ],
      es: [
        'Comprensión y procesamiento de lenguaje natural',
        'Integración con sistemas y flujos de trabajo empresariales',
        'Soporte multicanal (chat, correo electrónico, voz)',
        'Capacidades de aprendizaje de las interacciones del usuario',
        'Implementación de lógica empresarial personalizada',
      ],
    },
    results: {
      en: [
        '24/7 customer support availability',
        '40% reduction in support ticket resolution time',
        'Increased customer satisfaction metrics',
        'Automated handling of 70% of routine inquiries',
      ],
      es: [
        'Disponibilidad de soporte al cliente 24/7',
        '40% de reducción en el tiempo de resolución de tickets de soporte',
        'Aumento de las métricas de satisfacción del cliente',
        'Manejo automatizado del 70% de las consultas rutinarias',
      ],
    },
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF2D55',
  },
];
