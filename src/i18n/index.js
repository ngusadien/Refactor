import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS, LANGUAGES } from '../constants';

// Import translations
import en from './locales/en.json';
import sw from './locales/sw.json';

const resources = {
  en: { translation: en },
  sw: { translation: sw },
};

// Get saved language from localStorage
const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || LANGUAGES.EN;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: LANGUAGES.EN,
    interpolation: {
      escapeValue: false,
    },
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
});

export default i18n;
