import { BroadcasterKey, InputBroadcaster } from './broadcasting.ts';
import { point2Circle } from '../core/collision.ts';

type Pos = [number, number];

export enum MouseButton {
    Primary = 1,
    Secondary = 2,
    Auxiliary = 4,
    Forth = 8,
    Fifth = 16,
}

export function convertNaturalToMouseButtonBinaryNotation(button: number) {
    if (button == 1) button = 2;
    else if (button == 2) button = 1;
    return (1 << button) as MouseButton;
}

export enum MouseEventType {
    MouseDown,
    MouseUp,
    MouseClick,
}

export class MouseEventData {
    public readonly type: MouseEventType;

    public readonly position: Pos;

    public readonly previous_pos: Pos;

    public readonly screenPosition: Pos;

    public readonly documentPosition: Pos;

    public readonly altKey: boolean;

    public readonly ctrlKey: boolean;

    public readonly button: MouseButton;

    public readonly buttons_pressed: number;

    constructor(type: MouseEventType, position: Pos, screenPosition: Pos, documentPosition: Pos, altKey: boolean, ctrlKey: boolean, button: MouseButton, buttons_pressed: number, previous_pos?: Pos) {
        this.position = position;
        this.screenPosition = screenPosition;
        this.documentPosition = documentPosition;
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.button = button;
        this.buttons_pressed = buttons_pressed;
        this.type = type;
        this.previous_pos = previous_pos ?? [...this.position];
    }

    static of(element: HTMLCanvasElement, type: MouseEventType, event: MouseEvent, previous_pos?: Pos) {
        return new MouseEventData(
            type,
            [(event.pageX - element.offsetLeft) * element.width / element.offsetWidth, (event.pageY - element.offsetTop) * element.height / element.offsetHeight],
            [event.screenX, event.screenY],
            [event.pageX, event.pageY],
            event.altKey,
            event.ctrlKey,
            convertNaturalToMouseButtonBinaryNotation(event.button),
            event.buttons,
            previous_pos,
        );
    }
}

export const MOUSE: BroadcasterKey<MouseEventData> = BroadcasterKey.make(MouseEventData);

export class MouseBroadcaster implements InputBroadcaster<MouseEventData> {
    public readonly key: BroadcasterKey<MouseEventData> = MOUSE;

    public callbacks: Set<(event: MouseEventData) => void | boolean> = new Set();

    public element: HTMLCanvasElement | null = null;

    private mouse_start_pos?: [number, number];

    mousedown = (event: MouseEvent) => {
        if (this.element == null) return;
        const eventData = MouseEventData.of(this.element, MouseEventType.MouseDown, event);
        this.mouse_start_pos = eventData.position;
        this.dispatchEvent(eventData);
    };

    mouseup = (event: MouseEvent) => {
        if (this.element != null) this.dispatchEvent(MouseEventData.of(this.element, MouseEventType.MouseUp, event));
    };

    click = (event: MouseEvent) => {
        if ((this.element == null) || (this.mouse_start_pos == null)) return;
        const eventData = MouseEventData.of(this.element, MouseEventType.MouseClick, event, this.mouse_start_pos);
        if (point2Circle(this.mouse_start_pos, eventData.position, 10)) { this.dispatchEvent(eventData); }
    };

    attach(element: HTMLCanvasElement): void {
        this.element = element;
        document.addEventListener('mousedown', this.mousedown);
        document.addEventListener('mouseup', this.mouseup);
        document.addEventListener('click', this.click);
    }

    detach(element: HTMLCanvasElement): void {
        if (this.element == element) this.element = null;
        document.removeEventListener('mousedown', this.mousedown);
        document.removeEventListener('mouseup', this.mouseup);
        document.removeEventListener('click', this.click);
    }

    addEventListener(callback: (event: MouseEventData) => void | boolean): void {
        this.callbacks.add(callback);
    }

    dispatchEvent(event: MouseEventData): boolean {
        let d = false;
        this.callbacks.forEach(e => e(event) && (d = true));
        return d;
    }

    removeEventListener(callback: (event: MouseEventData) => void | boolean): void {
        this.callbacks.delete(callback);
    }
}
