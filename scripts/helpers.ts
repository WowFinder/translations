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

function isPrimitive(val: any): boolean {
    return (
        val === undefined ||
        val === null ||
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
    );
}

function addToObject(objRef: object): Action {
    const obj = objRef as any;
    return (baseName: string, raw: any): void => {
        if (obj[baseName] !== undefined) {
            if (isPrimitive(obj[baseName]) || isPrimitive(raw)) {
                throw new Error(`Duplicate key: ${baseName}`);
            }
            Object.assign(obj[baseName], raw);
        } else {
            obj[baseName] = raw;
        }
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
