import Dodo from "../Dodo";
import {BroadcasterKey, InputBroadcaster} from "./broadcasting.ts";
import { KeyboardBroadcaster } from "./keyboard";
import {MouseMovementBroadcaster} from "./mouse_movement.ts";

export class ListenerManager {
    public static readonly DEFAULT_BROADCASTERS: (() => InputBroadcaster<unknown>)[] = [
        () => new KeyboardBroadcaster(),
        () => new MouseMovementBroadcaster(),
    ]

    private readonly broadcasters: Map<Symbol, InputBroadcaster<unknown>> = new Map();
    readonly dodo: Dodo;

    constructor(dodo: Dodo){
        this.dodo = dodo;
        ListenerManager.DEFAULT_BROADCASTERS.forEach(e => {
            const b = e();
            this.addBroadcaster(b.key, b);
        })
    }

    getBroadcaster<T>(key: BroadcasterKey<T>) {
        return this.broadcasters.get(key.key) as (InputBroadcaster<T> | undefined);
    }

    addEventListener<T>(key: BroadcasterKey<T>, callback: (event: T) => void): void {
        this.getBroadcaster(key)?.addEventListener(callback);
    }

    removeEventListener<T>(key: BroadcasterKey<T>, callback: (event: T) => void): void {
        this.getBroadcaster(key)?.removeEventListener(callback);
    }

    addBroadcaster <T> (key: BroadcasterKey<T>, broadcaster: InputBroadcaster<T>) {
        if (this.broadcasters.has(key.key)){
            console.warn(new Error("Duplicated broadcaster, skipping..."));
            return;
        }
        broadcaster.attach(this.dodo.canvas);
        this.broadcasters.set(key.key, broadcaster);
    }

    removeBroadcaster <T> (key: BroadcasterKey<T>) {
        if (!this.broadcasters.has(key.key)){
            console.log(new Error("Broadcaster not found"));
        }
        this.broadcasters.get(key.key)?.detach(this.dodo.canvas);
        this.broadcasters.delete(key.key);
    }
}