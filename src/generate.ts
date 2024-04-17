import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { languages, targetGenerationDir, translationsDir } from './constants';
import { addToObject, recurseDir } from './helpers';

function buildLanguage(lang: string): void {
    console.info(`Building ${lang}...`);
    const raw: object = {};
    recurseDir(translationsDir, addToObject(raw));
    if (!(raw as any)[lang]) {
        throw new Error(`Language ${lang} not found`);
    }
    const rawTs = `const ${lang} = ${JSON.stringify((raw as any)[lang], null, 4)} as const;\nexport default ${lang};`;
    const targetPath = `${targetGenerationDir}/${lang}.ts`;
    writeFileSync(targetPath, rawTs);
}

function build(): void {
    if (!existsSync(targetGenerationDir)) {
        mkdirSync(targetGenerationDir);
    }
    console.info(
        `Building from ${translationsDir} to ${targetGenerationDir}...`,
    );
    languages.forEach((lang: string): void => {
        buildLanguage(lang);
    });
    const imports = languages
        .map(lang => `import ${lang} from './${lang}';`)
        .join('\n');
    const translationsExport = `export default {${languages.join(', ')}};`;
    const index = `${imports}\n${translationsExport}`;
    const indexPath = resolve(targetGenerationDir, 'index.ts');
    writeFileSync(indexPath, index);
}

build();
