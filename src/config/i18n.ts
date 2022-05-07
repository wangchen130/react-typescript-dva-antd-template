import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { defaultLocale } from './locales';

i18n.on('languageChanged', function (lng) {
  localStorage.setItem('i18nextLng', lng);
});

i18n
  .use(LanguageDetector) // 嗅探当前浏览器语言
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {},
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    keySeparator: false,
    debug: __DEV__,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
