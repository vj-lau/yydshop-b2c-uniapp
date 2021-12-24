interface MPAsyncFn {
    (options?: {
        success?: (result?: any) => void;
        fail?: () => void;
        complete?: () => void;
    }): any;
}
declare type MPAsyncFnOption<F extends MPAsyncFn> = F extends (options?: infer TOpt) => any ? TOpt : {};
declare type MPAsyncFnResult<F extends MPAsyncFn> = MPAsyncFnOption<F> extends {
    success?: (result: infer TRes) => void;
} ? TRes : void;
export declare function promisify<F extends MPAsyncFn>(asyncFunc: F): (options?: MPAsyncFnOption<F>) => Promise<MPAsyncFnResult<F>>;
export {};
