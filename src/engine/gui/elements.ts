import { IDisposable } from '../core/types.ts';
import Renderer from '../rendering/Renderer.ts';
import { MouseEventData } from '../input/mouse.ts';
import { IGUIMenu } from './controller.ts';
import { MouseMoveEventData } from '../input/mouse_movement.ts';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import { queueIterable } from '$/core/priorityQueue.ts';

export interface GUIElement extends IDisposable {
    get zIndex(): number
    render: (renderer: Renderer) => void
    tick?: (delta: number) => void
    mouseMove?: (event: MouseMoveEventData) => void
    mouseDown?: (event: MouseEventData) => void
    mouseUp?: (event: MouseEventData) => void
    click?: (event: MouseEventData) => void
}

export class BasicGUIMenu implements IGUIMenu {
    private readonly components: PriorityQueue<GUIElement>;

    constructor() {
        this.components = new PriorityQueue((a, b) => a.zIndex > b.zIndex ? 1 : a.zIndex < b.zIndex ? -1 : 0);
    }

    private forEachComponent(fn: (e: GUIElement) => void) {
        for (const entity of queueIterable(this.components)) {
            fn(entity);
        }
    }

    render(renderer: Renderer): void { this.forEachComponent(e => e.render(renderer)); }

    tick(delta: number): void { this.forEachComponent(e => (e.tick != null) && e.tick(delta)); }

    mouseMove?(event: MouseMoveEventData): void { this.forEachComponent(e => (e.mouseMove != null) && e.mouseMove(event)); }

    mouseDown?(event: MouseEventData): void { this.forEachComponent(e => (e.mouseDown != null) && e.mouseDown(event)); }

    mouseUp?(event: MouseEventData): void { this.forEachComponent(e => (e.mouseUp != null) && e.mouseUp(event)); }

    click?(event: MouseEventData): void { this.forEachComponent(e => (e.click != null) && e.click(event)); }

    dispose(): void { this.forEachComponent(e => e.dispose()); }

    addComponent(element: GUIElement) { this.components.push(element); this.forEachComponent(e => console.log(e)); console.log(this.components.size()); }
}
