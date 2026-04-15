export type ProjectCategory = 'Data Engineering' | 'Data Science' | 'Automation' | 'Process Optimization' | 'AI Development' | 'Web Development';

export interface Project {
  id: number;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  category: ProjectCategory;
  technologies: string[];
  features: {
    en: string[];
    es: string[];
  };
  results: {
    en: string[];
    es: string[];
  };
  image: string;
  color: string;
  link?: string;
}

export interface Experience {
  id: number;
  role: {
    en: string;
    es: string;
  };
  company: string;
  period: string;
  description: {
    en: string[];
    es: string[];
  };
  skills: string[];
  color: string;
}

export interface Skill {
  id: number;
  category: {
    en: string;
    es: string;
  };
  icon: string;
  items: string[];
  color: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
