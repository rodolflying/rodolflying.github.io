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
    items: ['AWS Pinpoint', 'Piano Composer', 'ChatGPT API', 'Gemini', 'REST', 'GraphQL', 'Web Scraping'],
    color: '#FF2D55',
  },
];

export const experiences: Experience[] = [
  {
    id: 0,
    role: {
      en: 'Technological Projects Engineer',
      es: 'Ingeniero de Proyectos Tecnológicos',
    },
    company: 'AMinerals, FCAB (Ferrocarril de Antofagasta a Bolivia)',
    period: '2025 - Present',
    description: {
      en: [
        'Developed RPA (Robotic Process Automation) solutions for real-time monitoring of critical equipment (Radios, GPS, Satellite Modems, Starlink, PLCs)',
        'Led comprehensive management of key technological projects, including Optalert, Emergency Stop, traffic light monitoring, and RPA Discovery',
        'Automated Power BI reports by implementing ETL data flows with Python, Oracle, Azure Entra ID, and Power BI Gateway',
        'Managed and automated SAP transactions to optimize operational processes',
        'Automated hardware maintenance processes using the Fracttal platform',
      ],
      es: [
        'Desarrollé soluciones RPA (Robotic Process Automation) para el monitoreo en tiempo real del estado de equipos críticos (Radios, GPS, Módems Satelitales, Starlink, PLCs)',
        'Lideré la gestión integral de proyectos tecnológicos clave, incluyendo Optalert, Parada de Emergencia, monitoreo de semáforos y RPA Discovery',
        'Automaticé reportes en Power BI, implementando flujos de datos ETL con Python, Oracle, Azure Entra ID y Power BI Gateway',
        'Gestioné y automaticé transacciones en SAP para optimizar procesos operativos',
        'Automaticé procesos de mantenimiento de hardware utilizando la plataforma Fracttal',
      ],
    },
    skills: ['RPA', 'Python', 'Power BI', 'SAP', 'ETL', 'Azure Entra ID', 'Project Management'],
    color: '#00FFC8',
  },
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
      en: 'SGP CORFO Mass Data Upload',
      es: 'Carga Masiva Plataforma SGP CORFO',
    },
    description: {
      en: 'Python-Selenium solution for automating mass data upload to the SGP CORFO platform for 1500+ documents.',
      es: 'Solución Python-Selenium para automatizar la carga masiva de datos en la plataforma SGP de CORFO para más de 1500 documentos.',
    },
    category: 'Automation',
    technologies: ['Python', 'Selenium', 'Web Automation', 'Data Extraction'],
    features: {
      en: [
        'Automated document upload and processing',
        'Data extraction and validation',
        'Bulk process management',
        'Error detection and handling',
      ],
      es: [
        'Carga y procesamiento automatizado de documentos',
        'Extracción y validación de datos',
        'Gestión de procesos masivos',
        'Detección y manejo de errores',
      ],
    },
    results: {
      en: [
        '80% efficiency improvement in document processing',
        '95% reduction in manual data entry errors',
        'Reduced reporting time from weeks to hours',
      ],
      es: [
        '80% de mejora de eficiencia en el procesamiento de documentos',
        '95% de reducción en errores de ingreso manual de datos',
        'Tiempo de carga masiva reducido de semanas a horas',
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
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
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
      en: 'Computrabajo Job Scraper GUI',
      es: 'Scraper GUI de Computrabajo',
    },
    description: {
      en: 'Desktop GUI application in Python to scrape, filter, and extract job listings from Computrabajo into Excel/CSV.',
      es: 'Aplicación de escritorio GUI en Python para extraer, filtrar y guardar ofertas de empleo de Computrabajo en Excel/CSV.',
    },
    category: 'Automation',
    technologies: ['Python', 'Tkinter', 'BeautifulSoup', 'Web Scraping', 'Pandas'],
    features: {
      en: [
        'Intuitive desktop Graphical User Interface',
        'Advanced filters (salary, location, remote work)',
        'Data export to Excel and CSV',
        'Multi-country support across LATAM',
      ],
      es: [
        'Interfaz Gráfica de Usuario (GUI) intuitiva de escritorio',
        'Filtros avanzados (salario, ubicación, teletrabajo)',
        'Exportación de datos a Excel y CSV',
        'Soporte multi-país en toda LATAM',
      ],
    },
    results: {
      en: [
        'Massive reduction in time spent searching for jobs',
        'Automated extraction of thousands of job postings',
        'Professional data cleaning and formatting',
      ],
      es: [
        'Reducción masiva de tiempo en la búsqueda de empleo',
        'Extracción automatizada de miles de ofertas de trabajo',
        'Limpieza y formateo profesional de datos',
      ],
    },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF2D55',
    link: '/downloads',
  },
  {
    id: 7,
    title: {
      en: 'JK Consultores - Financial Web',
      es: 'JK Consultores - Web Financiera',
    },
    description: {
      en: 'Corporate website for a financial consulting firm, featuring accounting, HR, and auditing service sections.',
      es: 'Sitio web corporativo para consultora financiera, con secciones de servicios contables, RRHH y auditoría.',
    },
    category: 'Web Development',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'SEO', 'Responsive Design'],
    features: {
      en: [
        'Clean and professional corporate interface',
        'Detailed service section for different business areas',
        'Fast loading speeds and optimized performance',
        'Contact system for potential clients',
      ],
      es: [
        'Interfaz corporativa limpia y profesional',
        'Sección detallada de servicios para áreas de negocio',
        'Velocidad de carga rápida y rendimiento optimizado',
        'Sistema de contacto para clientes potenciales',
      ],
    },
    results: {
      en: [
        'Enhanced online professional presence',
        'Streamlined service information for potential leads',
        'Improved brand credibility via high-end design',
      ],
      es: [
        'Presencia profesional en línea mejorada',
        'Información de servicios simplificada para leads',
        'Credibilidad de marca mejorada mediante diseño de alto nivel',
      ],
    },
    image: 'https://jkconsultores.cl/assets/Contabilidad%20y%20Finanzas_1754402129940-BhAxipcE.png',
    color: '#00FFC8',
    link: 'https://jkconsultores.cl/',
  },
  {
    id: 8,
    title: {
      en: 'Holistic Therapist Platform & Blog',
      es: 'Plataforma Terapeuta Holística & Blog',
    },
    description: {
      en: 'Modern platform for a holistic therapist with an integrated blog system for spirituality and well-being articles.',
      es: 'Plataforma moderna para terapeuta holística con sistema de blog integrado para artículos de espiritualidad y bienestar.',
    },
    category: 'Web Development',
    technologies: ['React', 'Markdown', 'Blog System', 'Responsive UX', 'Tailwind CSS'],
    features: {
      en: [
        'Full content management system for blog posts',
        'Zen-inspired visual layout for therapy services',
        'High performance and SEO optimization for articles',
        'Social media integration and contact forms',
      ],
      es: [
        'Sistema de gestión de contenidos para el blog',
        'Diseño visual inspirado en lo Zen para servicios de terapia',
        'Alto rendimiento y optimización SEO para artículos',
        'Integración con redes sociales y formularios de contacto',
      ],
    },
    results: {
      en: [
        'Increased audience reach through technical and spiritual blog posts',
        'Unified digital presence for multiple therapy disciplines',
        'Higher engagement from community through educational content',
      ],
      es: [
        'Aumento del alcance mediante el blog técnico y espiritual',
        'Presencia digital unificada para múltiples disciplinas',
        'Mayor compromiso de la comunidad mediante contenido educativo',
      ],
    },
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF9500',
    link: 'https://programming-runnner.github.io/',
  },
  {
    id: 9,
    title: {
      en: 'SII Bot (Chile Tax Declaration)',
      es: 'Bot SII (Declaración F29 sin movimientos)',
    },
    description: {
      en: 'Automates the monthly F29 tax declaration for inactive companies in Chile using Python and Selenium.',
      es: 'Automatiza la declaración mensual del Formulario F29 para empresas sin movimientos en Chile usando Python y Selenium.',
    },
    category: 'Automation',
    technologies: ['Python', 'Selenium', 'Web Automation', 'Chilean Tax (SII)'],
    features: {
      en: [
        'Automated login and navigation on the SII portal',
        'Zero-movement declaration submission in one click',
        'Automatic download and saving of the PDF voucher',
        'Generates CSV logs for tracking submissions',
      ],
      es: [
        'Inicio de sesión y navegación automática en el portal del SII',
        'Envío de la declaración sin movimientos en un clic',
        'Descarga automática y guardado del comprobante PDF',
        'Genera logs en formato CSV para el seguimiento',
      ],
    },
    results: {
      en: [
        'Created specifically to avoid unnecessary tax fines',
        'Open-source project on GitHub',
        'Solves a common bureaucratic problem for entrepreneurs',
      ],
      es: [
        'Creado específicamente para evitar multas tributarias innecesarias',
        'Proyecto de código abierto publicado en GitHub',
        'Resuelve un problema burocrático común para emprendedores',
      ],
    },
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#00FFC8',
    link: 'https://github.com/rodolflying/sii_bot',
  },
  {
    id: 10,
    title: {
      en: 'Good News Telegram Bot',
      es: 'Bot de Telegram de Buenas Noticias',
    },
    description: {
      en: 'Automated Telegram channel that actively scrapes Chilean news sites and uses AI to curate and publish only positive news.',
      es: 'Canal automatizado de Telegram que analiza sitios de noticias chilenos y usa IA para curar y publicar exclusivamente noticias positivas.',
    },
    category: 'AI Development',
    technologies: ['Python', 'Telegram API', 'NLP', 'Web Scraping', 'Prompt Engineering'],
    features: {
      en: [
        'Periodic news scraping from major news outlets',
        'AI-based sentiment analysis to filter bad news',
        'Automated formatting and posting to a Telegram channel',
        'Continuous execution via scheduled tasks',
      ],
      es: [
        'Scraping periódico de noticias de los principales medios',
        'Análisis de sentimiento con IA para filtrar noticias negativas',
        'Formateo y publicación automatizada en un canal de Telegram',
        'Ejecución continua a través de tareas programadas',
      ],
    },
    results: {
      en: [
        'Creates a healthier news consumption environment',
        'Fully autonomous pipeline from extraction to publishing',
      ],
      es: [
        'Crea un entorno de consumo de noticias más saludable',
        'Pipeline completamente autónomo desde la extracción hasta la publicación',
      ],
    },
    image: 'https://images.unsplash.com/photo-1529243856184-fd5465488984?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF9500',
    link: 'https://github.com/rodolflying/good_news',
  },
];
