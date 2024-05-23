import IScene from "../engine/scene/IScene";
import { notNull } from "../utils/Objects";

declare global {
    interface CanvasRenderingContext2D extends CanvasRenderingContext2DEx {}
}

type rect = [number,number,number,number];

interface CanvasRenderingContext2DEx {
    clear(color?: string | CanvasGradient | CanvasPattern): void;
    renderRect(fill: string | CanvasGradient | CanvasPattern, ...rect: rect): void;
}

CanvasRenderingContext2D.prototype.clear = function (color) {
    color && (this.fillStyle = color);
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasRenderingContext2D.prototype.renderRect = function (fill, ...rect) {
    this.fillStyle = fill;
    this.fillRect(...rect);
}


/*
class CanvasRenderingContext2DEx implements CanvasRenderingContext2D {
    private internal_context: CanvasRenderingContext2DEx;
    constructor(context: CanvasRenderingContext2DEx) {
        this.internal_context = context;
    }

    get canvas () : HTMLCanvasElement {
        return this.internal_context.canvas;
    }

    getContextAttributes(): CanvasRenderingContext2DSettings {
        return this.internal_context.getContextAttributes();
    }
    
    get globalAlpha () : number { return this.internal_context.globalAlpha }
    set globalAlpha (globalAlpha: number) { this.internal_context.globalAlpha = globalAlpha }

    get globalCompositeOperation () : GlobalCompositeOperation { return this.internal_context.globalCompositeOperation }
    set globalCompositeOperation (globalCompositeOperation: GlobalCompositeOperation) { this.internal_context.globalCompositeOperation = globalCompositeOperation }


    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, ...args : [number, number] | [number, number, number, number] | [number, number, number, number, number, number, number, number]): void {
        this.internal_context.drawImage(image, ...args);
    }
    beginPath(): void {
        throw new Error("Method not implemented.");
    }
    clip(fillRule?: CanvasFillRule | undefined): void;
    clip(path: Path2D, fillRule?: CanvasFillRule | undefined): void;
    clip(path?: unknown, fillRule?: unknown): void {
        throw new Error("Method not implemented.");
    }
    fill(fillRule?: CanvasFillRule | undefined): void;
    fill(path: Path2D, fillRule?: CanvasFillRule | undefined): void;
    fill(path?: unknown, fillRule?: unknown): void {
        throw new Error("Method not implemented.");
    }
    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule | undefined): boolean;
    isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule | undefined): boolean;
    isPointInPath(path: unknown, x: unknown, y?: unknown, fillRule?: unknown): boolean {
        throw new Error("Method not implemented.");
    }
    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: Path2D, x: number, y: number): boolean;
    isPointInStroke(path: unknown, x: unknown, y?: unknown): boolean {
        throw new Error("Method not implemented.");
    }
    stroke(): void;
    stroke(path: Path2D): void;
    stroke(path?: unknown): void {
        throw new Error("Method not implemented.");
    }
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
        throw new Error("Method not implemented.");
    }
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        throw new Error("Method not implemented.");
    }
    createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null {
        throw new Error("Method not implemented.");
    }
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
        throw new Error("Method not implemented.");
    }
    filter: string;
    createImageData(sw: number, sh: number, settings?: ImageDataSettings | undefined): ImageData;
    createImageData(imagedata: ImageData): ImageData;
    createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData {
        throw new Error("Method not implemented.");
    }
    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings | undefined): ImageData {
        throw new Error("Method not implemented.");
    }
    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    putImageData(imagedata: unknown, dx: unknown, dy: unknown, dirtyX?: unknown, dirtyY?: unknown, dirtyWidth?: unknown, dirtyHeight?: unknown): void {
        throw new Error("Method not implemented.");
    }
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: ImageSmoothingQuality;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        throw new Error("Method not implemented.");
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    closePath(): void {
        throw new Error("Method not implemented.");
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }
    lineTo(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    moveTo(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    rect(x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[] | undefined): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit> | undefined): void;
    roundRect(x: unknown, y: unknown, w: unknown, h: unknown, radii?: unknown): void {
        throw new Error("Method not implemented.");
    }
    lineCap: CanvasLineCap;
    lineDashOffset: number;
    lineJoin: CanvasLineJoin;
    lineWidth: number;
    miterLimit: number;
    getLineDash(): number[] {
        throw new Error("Method not implemented.");
    }
    setLineDash(segments: number[]): void;
    setLineDash(segments: Iterable<number>): void;
    setLineDash(segments: unknown): void {
        throw new Error("Method not implemented.");
    }
    clearRect(x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    fillRect(x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    strokeRect(x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    reset(): void {
        throw new Error("Method not implemented.");
    }
    restore(): void {
        throw new Error("Method not implemented.");
    }
    save(): void {
        throw new Error("Method not implemented.");
    }
    fillText(text: string, x: number, y: number, maxWidth?: number | undefined): void {
        throw new Error("Method not implemented.");
    }
    measureText(text: string): TextMetrics {
        throw new Error("Method not implemented.");
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number | undefined): void {
        throw new Error("Method not implemented.");
    }
    direction: CanvasDirection;
    font: string;
    fontKerning: CanvasFontKerning;
    fontStretch: CanvasFontStretch;
    fontVariantCaps: CanvasFontVariantCaps;
    letterSpacing: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    textRendering: CanvasTextRendering;
    wordSpacing: string;
    getTransform(): DOMMatrix {
        throw new Error("Method not implemented.");
    }
    resetTransform(): void {
        throw new Error("Method not implemented.");
    }
    rotate(angle: number): void {
        throw new Error("Method not implemented.");
    }
    scale(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit | undefined): void;
    setTransform(a?: unknown, b?: unknown, c?: unknown, d?: unknown, e?: unknown, f?: unknown): void {
        throw new Error("Method not implemented.");
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        throw new Error("Method not implemented.");
    }
    translate(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
    drawFocusIfNeeded(path: unknown, element?: unknown): void {
        throw new Error("Method not implemented.");
    }
    
}*/


export default class Renderer {
    private readonly canvas : HTMLCanvasElement;
    public readonly context : CanvasRenderingContext2D;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = notNull(this.canvas.getContext('2d'), "Couldn't not make context");
    }

    // TODO: replace with level type
    renderLevel(level: IScene) {
        this.context.clear("#ddd")
        level.render(this);
    }
}