export interface Download {
  id: number;
  title: { en: string; es: string };
  description: { en: string; es: string };
  longDescription: { en: string; es: string };
  version: string;
  size: string;
  category: { en: string; es: string };
  tags: string[];
  icon: string;
  color: string;
  downloadUrl: string;
  githubUrl?: string;
  features: { en: string[]; es: string[] };
  requirements: { en: string[]; es: string[] };
  screenshots?: string[];
  isNew?: boolean;
  downloads?: number;
}

export const downloads: Download[] = [
  {
    id: 1,
    title: {
      en: 'Computrabajo Job Scraper',
      es: 'Scraper de Empleo Computrabajo',
    },
    description: {
      en: 'Desktop GUI to scrape job listings from Computrabajo and export to CSV/Excel with advanced filters',
      es: 'GUI de escritorio para scrapear ofertas de empleo de Computrabajo y exportar a CSV/Excel con filtros avanzados',
    },
    longDescription: {
      en: 'A powerful Python GUI application that lets you search and download thousands of job listings from Computrabajo across multiple countries. Export results to CSV or Excel and apply advanced filters to find remote jobs, filter by salary, location, industry and more. Perfect for job seekers and recruiters.',
      es: 'Una potente aplicación GUI en Python que te permite buscar y descargar miles de ofertas de empleo de Computrabajo en múltiples países. Exporta resultados a CSV o Excel y aplica filtros avanzados para encontrar trabajos remotos, filtrar por salario, ubicación, industria y más. Perfecta para buscadores de empleo y reclutadores.',
    },
    version: '1.0.0',
    size: '376 MB',
    category: { en: 'Web Scraping', es: 'Web Scraping' },
    tags: ['Python', 'GUI', 'Web Scraping', 'Excel', 'CSV', 'Jobs'],
    icon: 'search',
    color: '#00FFC8',
    downloadUrl: 'https://drive.google.com/file/d/1JlL72ZsiYLx7votpGRABtBAyeAfPza_h/view?usp=sharing',
    githubUrl: 'https://github.com/rodolflying',
    features: {
      en: [
        'Search jobs by keyword and location across multiple countries',
        'Export results to CSV or Excel format',
        'Advanced filters: remote work, salary range, industry, contract type',
        'Intuitive graphical interface — no coding required',
        'Pagination support to download hundreds of listings at once',
        'Auto-save and session recovery',
      ],
      es: [
        'Busca empleos por palabra clave y ubicación en múltiples países',
        'Exporta resultados a formato CSV o Excel',
        'Filtros avanzados: trabajo remoto, rango salarial, industria, tipo de contrato',
        'Interfaz gráfica intuitiva — no requiere programación',
        'Soporte de paginación para descargar cientos de ofertas a la vez',
        'Auto-guardado y recuperación de sesión',
      ],
    },
    requirements: {
      en: ['Windows 10/11 (64-bit)', 'No Python installation required', '500MB free disk space', 'Internet connection'],
      es: ['Windows 10/11 (64-bit)', 'No requiere instalación de Python', '500MB de espacio libre en disco', 'Conexión a Internet'],
    },
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    ],
    isNew: true,
    downloads: 0,
  },
];
