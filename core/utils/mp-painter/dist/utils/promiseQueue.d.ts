export declare function promiseQueue<T>(queue: (() => Promise<T>)[]): Promise<T[]>;
