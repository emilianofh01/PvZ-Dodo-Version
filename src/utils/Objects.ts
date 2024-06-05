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
