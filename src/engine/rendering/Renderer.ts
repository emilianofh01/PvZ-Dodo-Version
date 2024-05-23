import IScene from "../scene/IScene";
import { notNull } from "../../utils/Objects";

declare global {
    interface CanvasRenderingContext2D extends CanvasRenderingContext2DEx {}
}

export type BackdropFill = string | CanvasGradient | CanvasPattern;
export type rect = [number,number,number,number];

export interface CanvasRenderingContext2DEx {
    clear(color?: BackdropFill): void;
    renderRect(fill: BackdropFill, ...rect: rect): void;
}

CanvasRenderingContext2D.prototype.clear = function (color) {
    color && (this.fillStyle = color);
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasRenderingContext2D.prototype.renderRect = function (fill, ...rect) {
    this.fillStyle = fill;
    this.fillRect(...rect);
}

export default class Renderer {
    private readonly canvas : HTMLCanvasElement;
    public readonly context : CanvasRenderingContext2D;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = notNull(this.canvas.getContext('2d'), "Couldn't not make context");
    }

    renderLevel(level: IScene) {
        this.context.clear(level.fill);
        level.render(this);
    }
}