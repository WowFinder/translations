interface DeepRecord {
    [key: string]: DeepRecord | string;
}

type RecursiveFileLoader = (localBaseFileName: string) => DeepRecord | string;

export type { DeepRecord, RecursiveFileLoader };
