import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, useTranslation } from 'react-i18next';
import resources from './translations';
import { supportedLngs } from './supportedLngs';

function initTranslations(): typeof i18n {
    if ((global as any).i18n) return (global as any).i18n;

    (global as any).i18n = i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'en',
            debug: true,
            interpolation: {
                escapeValue: false,
            },
            supportedLngs,
        });
    return i18n;
}

export { initTranslations, useTranslation, supportedLngs };
