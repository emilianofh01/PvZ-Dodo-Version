type BroadcasterType<A> = { new(...args: any): A };

export class BroadcasterKey<T> {
    readonly key: Symbol;
    readonly type: BroadcasterType<T>;

    private constructor(type: BroadcasterType<T>){
        this.type = type;
        this.key = Symbol();
    }

    static make <T> (type: BroadcasterType<T>){
        return new BroadcasterKey<T>(type);
    }
}

export interface InputBroadcaster<T> {
    key: BroadcasterKey<T>;
    attach(canvas: HTMLCanvasElement): void;
    detach(canvas: HTMLCanvasElement): void;

    addEventListener(callback: (event: T) => void): void;
    dispatchEvent(event: T): boolean;
    removeEventListener(callback: (event: T) => void): void;
}