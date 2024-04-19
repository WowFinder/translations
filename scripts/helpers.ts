// TODO Migrate to `@wowfinder/core-node` and import as devDependency
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import JSON5 from 'json5';

function fileFilter(s: string): boolean {
    return (
        /\.json5?$/i.test(s) ||
        /\.txt$/i.test(s) ||
        /\.md$/i.test(s) ||
        /\.html$/i.test(s)
    );
}

type Action = (baseName: string, raw: any) => void;

function addToObject(objRef: object): Action {
    return (baseName: string, raw: any): void => {
        (objRef as any)[baseName] = raw;
    };
}

function recurseDir(path: string, action: Action): void {
    for (const subPath of readdirSync(path, { withFileTypes: true })) {
        const resolvedPath = resolve(path, subPath.name);
        if (subPath.isDirectory()) {
            const obj: object = {} as any;
            recurseDir(resolvedPath, addToObject(obj));
            action(subPath.name, obj);
        } else if (subPath.isFile()) {
            if (fileFilter(subPath.name)) {
                const rawData = readFileSync(resolvedPath).toString();
                const obj = /\.json5?$/.test(subPath.name)
                    ? JSON5.parse(rawData)
                    : rawData;
                action(subPath.name.replace(/\.[^/.]+$/, ''), obj);
            }
        } else {
            throw new Error('Unexpected file type');
        }
    }
}

export { recurseDir, addToObject };
