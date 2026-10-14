/** Open-source tools we built for ourselves and published on GitHub. Stars are shown from 10 up. */
export interface Repo {
  name: string;
  url: string;
  description: { es: string; en: string };
  stack: string;
  stars?: number;
  forks?: number;
  /** Blog post that explains it, when there is one. */
  post?: string;
}

export const repos: Repo[] = [
  {
    name: 'GPT_scraper',
    url: 'https://github.com/rodolflying/GPT_scraper',
    description: {
      es: 'Extrae tu historial completo de ChatGPT por dos caminos: los endpoints internos de la web o un navegador automatizado.',
      en: 'Exports your full ChatGPT history two ways: the web app’s internal endpoints or an automated browser.',
    },
    stack: 'Python · Requests · Selenium',
    stars: 139,
    forks: 12,
    post: 'integrar-sistemas-sin-api',
  },
  {
    name: 'sii_bot',
    url: 'https://github.com/rodolflying/sii_bot',
    description: {
      es: 'Declara el F29 sin movimiento en el portal del SII y guarda el folio de cada mes.',
      en: 'Files the zero-activity F29 return on Chile’s tax portal and keeps each month’s receipt number.',
    },
    stack: 'Python · Selenium',
    post: 'declarar-f29-sin-movimiento-automatico',
  },
  {
    name: 'AutoRead',
    url: 'https://github.com/rodolflying/TextToSpeech-ChromeExtension',
    description: {
      es: 'Extensión de Chrome que lee en voz alta el texto que selecciones, limpio y por párrafos para que suene natural.',
      en: 'A Chrome extension that reads the text you select aloud, cleaned and by paragraph so it sounds natural.',
    },
    stack: 'JavaScript · Chrome',
    post: 'extension-chrome-leer-en-voz-alta',
  },
  {
    name: 'create_requirements_file',
    url: 'https://github.com/rodolflying/create_requirements_file',
    description: {
      es: 'Genera el requirements.txt de un proyecto Python a partir de sus imports, sin ejecutar el código.',
      en: 'Builds a Python project’s requirements.txt from its imports, without running the code.',
    },
    stack: 'Python · ast',
  },
  {
    name: 'gemini_web_search',
    url: 'https://github.com/rodolflying/gemini_web_search',
    description: {
      es: 'La API de Gemini con búsqueda web, dentro del plan gratuito, para resúmenes con fuentes al día.',
      en: 'The Gemini API with web search on the free tier, for up-to-date summaries with sources.',
    },
    stack: 'Python · Gemini API',
  },
];
