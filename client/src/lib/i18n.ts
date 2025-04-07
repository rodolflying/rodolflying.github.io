import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../data/translations/en.json';
import esTranslation from '../data/translations/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
