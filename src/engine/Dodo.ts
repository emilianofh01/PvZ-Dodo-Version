import Renderer from "../rendering/Renderer";

export default class Dodo {
    public readonly canvas: HTMLCanvasElement;
    public readonly renderer: Renderer;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
    }

}