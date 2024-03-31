import { RecursiveFileLoader } from 'helpers';
import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const langs = ['en', 'es'];

type InitTranslationsArgs = {
    loader: RecursiveFileLoader;
    debug?: boolean;
};

function initTranslations({
    loader,
    debug = false,
}: InitTranslationsArgs): void {
    const resources: Resource = {};

    langs.forEach((lang: string): void => {
        resources[lang] = {
            translation: loader(lang),
        };
    });

    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'en',
            debug,
            interpolation: {
                escapeValue: false,
            },
        });
}

export type { InitTranslationsArgs };
export { initTranslations };
