
interface EventListenerTyped<T extends Event> {
    (evt: T): void;
}

export abstract class MappedEventTarget<Map extends { [key: string]: Event }> extends EventTarget {
    
    addEventListener<K extends keyof Map>(type: K, listener: EventListenerObject | EventListenerTyped<Map[K]> | null, options?: boolean | AddEventListenerOptions): void {
        super.addEventListener(type as string, listener as EventListenerOrEventListenerObject, options);
    }
    
    removeEventListener<K extends keyof Map>(type: K, listener: EventListenerObject | EventListenerTyped<Map[K]> | null, options?: boolean | AddEventListenerOptions): void {
        super.removeEventListener(type as string, listener as EventListenerOrEventListenerObject, options);
    }

    dispatchEvent(event: Map[keyof Map]): boolean {
        return super.dispatchEvent(event);
    }
}