export function notNull <T>(obj: T | null, error?: string): T {
    if (obj === null) throw new TypeError(error ?? 'This object cannot be null');
    return obj;
}

export function notNullOrUndefined <T>(obj: T | null | undefined, error?: string): T {
    if (obj === null || obj === undefined) throw new TypeError(error ?? 'This object cannot be null');
    return obj;
}

export function map<T, R>(obj: T, fn: (obj: T) => R): R {
    return fn(obj);
}


export class PromiseWaiter<T> {
    promise: Promise<T>;

    element_loaded: T | null = null;

    constructor(promise: Promise<T>) {
        this.promise = promise;
        this.promise.then(e => this.element_loaded = e);
    }

    get() {
        return this.element_loaded;
    }
}