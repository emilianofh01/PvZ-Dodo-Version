import Dodo from "../../engine/Dodo";
import { point2Rect } from "../../engine/core/collision";
import { MouseEventData } from "../../engine/input/mouse";
import { MouseMoveEventData } from "../../engine/input/mouse_movement";
import Renderer from "../../engine/rendering/Renderer";
import { GUIElement } from "../elements";

interface AbstractButtonConfig<B extends AbstractButton<any>> {
    position: [number, number]
    size: [number, number]
    zIndex: number
    onClick(): void
    render(renderer: Renderer, mouseOver: boolean, mousePressed: boolean, button: B): void
}

export class AbstractButton<T extends AbstractButtonConfig<any>> implements GUIElement {
    readonly zIndex: number;
    readonly dodo: Dodo;
    readonly config: T;
    
    public mouseOver: boolean = false;
    public mousePressed: boolean = false;
    
    constructor(dodo: Dodo, config: T) {
        this.dodo = dodo;
        this.config = config;
        this.zIndex = this.config.zIndex;
    }
    
    render(renderer: Renderer): void {
        this.config.render(renderer, this.mouseOver, this.mousePressed, this)
    }
    
    mouseDown(event: MouseEventData) {
        this.mousePressed = point2Rect(event.position, [...this.config.position, ...this.config.size]);
    }
    
    mouseUp(_: MouseEventData) {
        this.mousePressed = false;
    }

    click(data: MouseEventData) {
        if (!point2Rect(data.position, [...this.config.position, ...this.config.size]) || !point2Rect(data.previous_pos, [...this.config.position, ...this.config.size])) return; 
        this.config.onClick();
    }
    
    mouseMove(event: MouseMoveEventData) {
        this.mouseOver = point2Rect(event.position, [...this.config.position, ...this.config.size]); 
    }

    dispose(): void {
    }
    
}

export interface ButtonConfig extends AbstractButtonConfig<Button> {
}


export class Button extends AbstractButton<ButtonConfig> {
    
    public static defaultButtonConfig : ButtonConfig = {
        position: [0, 0],
        size: [100, 30],
        zIndex: 0,
        onClick: () => {},
        render: (renderer, mouseOver, mousePressed, button) => {
            renderer.context.renderRect(mouseOver ? mousePressed ? "#000" : "#333" : "#666", ...button.config.position, ...button.config.size);
        }
    };
    
    constructor(dodo: Dodo, config: Partial<ButtonConfig>) {
        super(dodo, {...Button.defaultButtonConfig, ...config});
    }
}