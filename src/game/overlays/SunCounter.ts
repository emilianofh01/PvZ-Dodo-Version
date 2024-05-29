import {IGUIOverlay} from "$/gui/controller.ts";
import Renderer from "$/rendering/Renderer.ts";

export class SunCounter implements  IGUIOverlay {
    readonly zIndex = 0;
    
    readonly sunGetter: () => number;
    
    constructor(sunGetter: () => number) {
        this.sunGetter = sunGetter;
    }
    
    render(renderer: Renderer) {
        renderer.context.renderRect("#fff", ...[0, 0, renderer.context.canvas.width, 64+16]);
        renderer.context.renderRect("#0ff", ...[8, 8, 48, 64]);
        
        renderer.context.textAlign = "center";
        renderer.context.textBaseline = "bottom";
        renderer.context.fillStyle = "#000";
        renderer.context.font = "16px pixel";
        renderer.context.textRendering = "geometricPrecision";
        renderer.context.fillText(this.sunGetter().toFixed(), 32, 70);
    }
    
    tick(_: number) {
    }
    
    dispose() {
    }
}