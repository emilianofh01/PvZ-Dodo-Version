export interface IDisposable {
    dispose: () => void
}

type PartialObject<T> = {
    [key in keyof T ]?: T[key]
};

export type { PartialObject };