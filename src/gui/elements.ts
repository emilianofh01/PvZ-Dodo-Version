import {IDisposable} from "../engine/core/types.ts";
import Renderer from "../engine/rendering/Renderer.ts";
import {MouseEventData} from "../engine/input/mouse.ts";
import {IGUIMenu} from "./controller.ts";
import {PriorityQueue} from "../engine/core/priority_queue.ts";
import {MouseMoveEventData} from "../engine/input/mouse_movement.ts";

export interface GUIElement extends IDisposable{
    get zIndex(): number;
    render(renderer: Renderer): void;
    tick?(delta: number): void;
    mouseMove?(event: MouseMoveEventData): void;
    mouseDown?(event: MouseEventData): void;
    mouseUp?(event: MouseEventData): void;
    click?(event: MouseEventData): void;
}

export class BasicGUIMenu implements IGUIMenu{
    private readonly components: PriorityQueue<GUIElement>;
    
    constructor() {
        this.components = new PriorityQueue((a, b) => a.zIndex > b.zIndex)
    }
    
    render(renderer: Renderer): void { this.components.forEach(e => e.render(renderer)); }
    
    tick(delta: number): void { this.components.forEach(e => e.tick && e.tick(delta)); }
    
    mouseMove?(event: MouseMoveEventData): void { this.components.forEach(e => e.mouseMove && e.mouseMove(event)); }
    
    mouseDown?(event: MouseEventData): void { this.components.forEach(e => e.mouseDown && e.mouseDown(event)); }
    
    mouseUp?(event: MouseEventData): void { this.components.forEach(e => e.mouseUp && e.mouseUp(event)); }
    
    click?(event: MouseEventData): void { this.components.forEach(e => e.click && e.click(event)); }
    
    dispose(): void { this.components.forEach(e => e.dispose()); }
    
    addComponent(element: GUIElement){ this.components.push(element); }
}