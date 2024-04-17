import fs from 'fs';
import path from 'path';
import { distDir } from './constants';

/* istanbul ignore next: build script - not testable via jest */
function writeBufferSync(filePath: string[], raw: string): void {
    fs.writeFileSync(
        path.resolve(distDir, ...filePath),
        Buffer.from(raw, 'utf-8'),
    );
}

/* istanbul ignore next: build script - not testable via jest */
function copyFromParentSync(baseName: string): void {
    fs.copyFileSync(path.resolve(baseName), path.resolve(distDir, baseName));
}

/* istanbul ignore next: build script - not testable via jest */
function main(): void {
    const source = fs
        .readFileSync(path.resolve('package.json'))
        .toString('utf-8');
    const sourceObj = JSON.parse(source);
    sourceObj.scripts = {};
    sourceObj.devDependencies = {};
    const prefix = `${distDir}/`;
    const prefixLength = prefix.length;
    if (sourceObj.main.startsWith(prefix)) {
        sourceObj.main = sourceObj.main.slice(prefixLength);
    }
    if (sourceObj.types.startsWith(prefix)) {
        sourceObj.types = sourceObj.types.slice(prefixLength);
    }
    writeBufferSync(['package.json'], JSON.stringify(sourceObj, null, 2));
    writeBufferSync(['version.txt'], sourceObj.version);
    writeBufferSync(['yarn.lock'], '');
    copyFromParentSync('LICENSE');
    copyFromParentSync('README.md');
    copyFromParentSync('.npmignore');
}

function cleanup(): void {
    fs.unlinkSync(path.resolve(distDir, 'version.txt'));
    fs.unlinkSync(path.resolve(distDir, 'yarn.lock'));
    fs.unlinkSync(path.resolve(distDir, 'LICENSE'));
    fs.unlinkSync(path.resolve(distDir, 'README.md'));
    fs.unlinkSync(path.resolve(distDir, '.npmignore'));
    fs.unlinkSync(path.resolve(distDir, 'package.json'));
}

main();

export { cleanup };
