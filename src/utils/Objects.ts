export function notNull <T> (obj: T | null, error?: string) : T {
    if(obj == null) throw new TypeError(error ?? "This object cannot be null");
    return obj;
}