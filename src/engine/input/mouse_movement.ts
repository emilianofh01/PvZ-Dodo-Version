import {BroadcasterKey, InputBroadcaster} from "./broadcasting.ts";

export class MouseMoveEventData {

}

export const MOUSE_MOVE: BroadcasterKey<MouseMoveEventData> = BroadcasterKey.make(MouseMoveEventData);


export class MouseMovementBroadcaster implements InputBroadcaster<MouseMoveEventData>{
    public readonly key: BroadcasterKey<MouseMoveEventData> = MOUSE_MOVE;
    public callbacks: Set<(event: MouseMoveEventData) => void | boolean> = new Set();
    
    mousemove = (event: MouseEvent) => {
        this.dispatchEvent(new MouseMoveEventData())
    }

    attach(_: HTMLCanvasElement): void {
        document.addEventListener('mousemove', this.mousemove);
    }

    detach(_: HTMLCanvasElement): void {
        document.removeEventListener('mousemove', this.mousemove);
    }

    addEventListener(callback: (event: MouseMoveEventData) => void | boolean): void {
        this.callbacks.add(callback);
    }

    dispatchEvent(event: MouseMoveEventData): boolean {
        let d = false;
        this.callbacks.forEach(e => e(event) && (d = true));
        return d;
    }

    removeEventListener(callback: (event: MouseMoveEventData) => void | boolean): void {
        this.callbacks.delete(callback);
    }

}