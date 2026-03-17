export interface BlogPost {
  id: number;
  slug: string;
  title: { en: string; es: string };
  excerpt: { en: string; es: string };
  category: string;
  tags: string[];
  date: string;
  readTime: { en: string; es: string };
  mediumUrl?: string;
  githubUrl?: string;
  image: string;
  color: string;
  featured?: boolean;
  type: 'tutorial' | 'guide' | 'article' | 'project';
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'computrabajo-scraper-guide',
    title: {
      en: 'How to Use the Computrabajo Job Scraper — Complete Guide',
      es: 'Cómo Usar el Scraper de Empleo Computrabajo — Guía Completa',
    },
    excerpt: {
      en: 'Step-by-step tutorial to install, configure and get the most out of the Computrabajo Scraper GUI. Learn how to find remote jobs across multiple countries and export to Excel.',
      es: 'Tutorial paso a paso para instalar, configurar y sacar el máximo provecho del Scraper GUI de Computrabajo. Aprende a encontrar trabajos remotos en múltiples países y exportar a Excel.',
    },
    category: 'Tutorial',
    tags: ['Python', 'Web Scraping', 'GUI', 'Computrabajo', 'Excel'],
    date: '2025-01-15',
    readTime: { en: '10 min read', es: '10 min de lectura' },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#00FFC8',
    featured: true,
    type: 'tutorial',
  },
  {
    id: 2,
    slug: 'automate-excel-python',
    title: {
      en: 'Automating Excel Reports with Python — From Zero to Hero',
      es: 'Automatizando Reportes Excel con Python — De Cero a Experto',
    },
    excerpt: {
      en: 'Learn how to automate your Excel workflows using Python, openpyxl and pandas. Save hours of manual work every week.',
      es: 'Aprende a automatizar tus flujos de trabajo en Excel usando Python, openpyxl y pandas. Ahorra horas de trabajo manual cada semana.',
    },
    category: 'Tutorial',
    tags: ['Python', 'Excel', 'Automation', 'openpyxl', 'pandas'],
    date: '2024-12-10',
    readTime: { en: '12 min read', es: '12 min de lectura' },
    mediumUrl: 'https://medium.com/@rodolfo.antonio.sep',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF2D55',
    type: 'tutorial',
  },
  {
    id: 3,
    slug: 'web-scraping-selenium-python',
    title: {
      en: 'Web Scraping with Selenium and Python — Practical Guide',
      es: 'Web Scraping con Selenium y Python — Guía Práctica',
    },
    excerpt: {
      en: 'A hands-on guide to extracting data from dynamic websites using Selenium. Includes real examples, error handling, and best practices.',
      es: 'Una guía práctica para extraer datos de sitios web dinámicos usando Selenium. Incluye ejemplos reales, manejo de errores y buenas prácticas.',
    },
    category: 'Guide',
    tags: ['Python', 'Selenium', 'Web Scraping', 'Automation', 'BeautifulSoup'],
    date: '2024-11-05',
    readTime: { en: '15 min read', es: '15 min de lectura' },
    mediumUrl: 'https://medium.com/@rodolfo.antonio.sep',
    githubUrl: 'https://github.com/rodolflying',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#6B38FB',
    type: 'guide',
  },
  {
    id: 4,
    slug: 'python-gui-tkinter',
    title: {
      en: 'Creating Desktop Apps with Python and Tkinter',
      es: 'Creando Apps de Escritorio con Python y Tkinter',
    },
    excerpt: {
      en: 'Learn to build intuitive desktop GUIs with Python and Tkinter. Package them as .exe files so anyone can run them without Python installed.',
      es: 'Aprende a crear GUIs de escritorio intuitivas con Python y Tkinter. Empaquétalas como .exe para que cualquiera pueda ejecutarlas sin tener Python instalado.',
    },
    category: 'Tutorial',
    tags: ['Python', 'Tkinter', 'GUI', 'PyInstaller', 'Desktop'],
    date: '2024-10-20',
    readTime: { en: '20 min read', es: '20 min de lectura' },
    mediumUrl: 'https://medium.com/@rodolfo.antonio.sep',
    githubUrl: 'https://github.com/rodolflying',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF9500',
    type: 'tutorial',
  },
  {
    id: 5,
    slug: 'nlp-sentiment-analysis',
    title: {
      en: 'Sentiment Analysis with NLP and Python — Complete Pipeline',
      es: 'Análisis de Sentimiento con NLP y Python — Pipeline Completo',
    },
    excerpt: {
      en: 'Build a complete NLP pipeline for sentiment analysis from scratch. Includes data collection, preprocessing, model training and deployment.',
      es: 'Construye un pipeline NLP completo para análisis de sentimiento desde cero. Incluye recolección de datos, preprocesamiento, entrenamiento del modelo y despliegue.',
    },
    category: 'Article',
    tags: ['Python', 'NLP', 'Machine Learning', 'Sentiment Analysis', 'scikit-learn'],
    date: '2024-09-08',
    readTime: { en: '18 min read', es: '18 min de lectura' },
    mediumUrl: 'https://medium.com/@rodolfo.antonio.sep',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#00FFC8',
    type: 'article',
  },
  {
    id: 6,
    slug: 'aws-lambda-automation',
    title: {
      en: 'Serverless Automation with AWS Lambda and Python',
      es: 'Automatización Serverless con AWS Lambda y Python',
    },
    excerpt: {
      en: 'Deploy Python automations to AWS Lambda and run them on a schedule. Perfect for newsletters, reports, and data pipelines without managing servers.',
      es: 'Despliega automatizaciones Python en AWS Lambda y ejecútalas de forma programada. Perfecto para newsletters, reportes y pipelines de datos sin gestionar servidores.',
    },
    category: 'Guide',
    tags: ['AWS', 'Lambda', 'Python', 'Serverless', 'Automation'],
    date: '2024-08-15',
    readTime: { en: '14 min read', es: '14 min de lectura' },
    mediumUrl: 'https://medium.com/@rodolfo.antonio.sep',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    color: '#FF2D55',
    type: 'article',
  },
];
