import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import lngEN from 'languages/en.json';
import lngES from 'languages/es.json';

const configI18n = (language: string = 'es', cookieDomain: string) => {
  i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...lngEN } },
      es: { translation: { ...lngES } },
    },
    lng: language,
    fallbackLng: ['es', 'en'],
    interpolation: { escapeValue: false },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'],
      cookieMinutes: 10,
      cookieDomain,
      htmlTag: document.documentElement,
      cookieOptions: { path: '/', sameSite: 'strict' },
    },
  });
};

export default configI18n;