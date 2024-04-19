import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { languages, targetGenerationDir, translationsDir } from './constants';
import { addToObject, recurseDir } from './helpers';

function buildLanguage(lang: string, raw: object): void {
    if (!(raw as any)[lang]) {
        throw new Error(`Language ${lang} not found`);
    }
    const wrapped = { translation: (raw as any)[lang] };
    const stringified = JSON.stringify(wrapped, null, 4);
    const rawTs = `const ${lang} = ${stringified} as const;\nexport default ${lang};`;
    const targetPath = `${targetGenerationDir}/${lang}.ts`;
    writeFileSync(targetPath, rawTs);
}

function build(): void {
    if (!existsSync(targetGenerationDir)) {
        mkdirSync(targetGenerationDir);
    }
    const raw: object = {};
    recurseDir(translationsDir, addToObject(raw));
    languages.forEach((lang: string): void => {
        buildLanguage(lang, raw);
    });
    const imports = languages
        .map(lang => `import ${lang} from './${lang}';`)
        .join('\n');
    const translationsExport = `export default {${languages.join(', ')}} as any;`;
    writeFileSync(
        resolve(targetGenerationDir, 'translations.ts'),
        `${imports}\n${translationsExport}`,
    );
    const supportedLngs = `export const supportedLngs = ${JSON.stringify(languages)};`;
    writeFileSync(
        resolve(targetGenerationDir, 'supportedLngs.ts'),
        supportedLngs,
    );
}

build();
