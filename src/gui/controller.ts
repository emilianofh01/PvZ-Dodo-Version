import Dodo from "../engine/Dodo.ts";
import {PriorityQueue} from "../engine/core/priority_queue.ts";
import Renderer from "../engine/rendering/Renderer.ts";
import {MOUSE, MouseEventData, MouseEventType} from "../engine/input/mouse.ts";
import {IDisposable} from "../engine/core/types.ts";

export interface IGUIController extends IDisposable {
    render(renderer: Renderer): void;
    
    tick(delta: number): void;
    addOverlay(overlay: IGUIOverlay): void;
    removeOverlay(overlay: IGUIOverlay): void;
    setMenu(menu: IGUIMenu): void;
}

export interface IGUIOverlay extends IDisposable {
    get zIndex(): number;

    render(renderer: Renderer): void;

    tick(delta: number): void;
}

export interface IGUIMenu extends IDisposable {
    render(renderer: Renderer): void;
    tick(delta: number): void;
    mouseDown?(event: MouseEventData): void;
    mouseUp?(event: MouseEventData): void;
    click?(event: MouseEventData): void;
}

export class BasicGuiController implements IGUIController {
    public readonly dodo: Dodo;
    public readonly overlays: PriorityQueue<IGUIOverlay>;
    public currentMenu: IGUIMenu | null;

    constructor(dodo: Dodo, menu?: IGUIMenu) {
        this.dodo = dodo;
        this.overlays = new PriorityQueue<IGUIOverlay>((a, b) => a.zIndex > b.zIndex);
        this.currentMenu = menu ?? null;
        this.dodo.listener_manager.addEventListener(MOUSE, this.mouseEvent);
    }

    mouseEvent = (mouseEvent: MouseEventData) => {
        if(!this.currentMenu) return; 
        if(mouseEvent.type == MouseEventType.MouseDown){
            this.currentMenu?.mouseDown && this.currentMenu.mouseDown(mouseEvent);
            return;
        }
        if(mouseEvent.type == MouseEventType.MouseUp){
            this.currentMenu?.mouseUp && this.currentMenu.mouseUp(mouseEvent);
            return;
        }
        if(mouseEvent.type == MouseEventType.MouseClick){
            this.currentMenu?.click && this.currentMenu.click(mouseEvent);
            return;
        }
    }
    
    dispose(){
        this.overlays.forEach(e => e.dispose());
        this.currentMenu?.dispose();
    }

    render(renderer: Renderer): void {
        this.overlays.forEach(e => e.zIndex < 0 && e.render(renderer));
        this.currentMenu?.render(renderer);
        this.overlays.forEach(e => e.zIndex >= 0 && e.render(renderer));
    }
    
    tick(delta: number): void {
        this.currentMenu?.tick(delta);
        this.overlays.forEach(e => e.tick(delta));
    }
    
    addOverlay(overlay: IGUIOverlay){
        this.overlays.push(overlay);
    }
    
    removeOverlay(overlay: IGUIOverlay){
        this.overlays.remove(overlay)?.dispose();
    }
    
    setMenu(menu: IGUIMenu | null){
        this.currentMenu?.dispose();
        this.currentMenu = menu;
    }
}