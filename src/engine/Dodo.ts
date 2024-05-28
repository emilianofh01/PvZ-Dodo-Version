import { ListenerManager } from "./input/listener";
import Renderer from "./rendering/Renderer";
import IScene from "./scene/IScene";

export default class Dodo {
    public readonly canvas: HTMLCanvasElement;
    public readonly renderer: Renderer;
    public readonly listener_manager: ListenerManager;
    private _currentScene: IScene | null = null;
    private last_update: DOMHighResTimeStamp | null = null;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.listener_manager = new ListenerManager(this);
    }

    get currentScene(){
        return this._currentScene;
    }

    transitionTo(provider: (dodo: Dodo) => IScene){
        this._currentScene?.dispose();
        this._currentScene = provider(this);
    }

    update(delta: number){
        this._currentScene?.update(delta);
    }

    render(){
        this._currentScene && this.renderer.renderLevel(this._currentScene);
    }

    loop(timer: DOMHighResTimeStamp){
        if(this.last_update == null){
            this.last_update = timer;
        }
        const delta = timer - this.last_update;
        this.update(delta);
        this.render();
    }
}