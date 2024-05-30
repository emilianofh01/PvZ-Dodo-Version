import Entity from "./Entity.ts";
import Dodo from "../engine/Dodo.ts";
import ResourceManagement from "../engine/resource_management/ResourceManager.ts";
import {ASSET_TYPES, AssetKey} from "../engine/resource_management/IResourceLoader.ts";
import Renderer, {PIVOTS} from "../engine/rendering/Renderer.ts";
import { MOUSE, MouseButton, MouseEventData } from "$/input/mouse.ts";
import { point2Rect } from "$/core/collision.ts";
import { Game } from "src/game/scenes/Game.ts";

export interface SunProperties {
    degreesPerSecond: number
    position: [number, number]
    size: [number, number]
    sunAmount: number
}

export class SunEntity<T extends SunProperties = SunProperties> implements Entity {
    rotation: number;
    properties: T;
    dodo: Dodo;
    sunSprite: CanvasImageSource | null;
    scale: number = 1;
    
    _boundingBox: [number,number,number,number];
    _boundingBoxWPivot: [number,number,number,number];
    
    get boundingBox () {
        return this._boundingBox;
    }
    
    readonly zIndex = 0;
    
    constructor(props: T, dodo: Dodo) {
        this.properties = props;
        this.rotation = 0;
        this.dodo = dodo;
        this.sunSprite = null;
        ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, "./assets/img/sun.png")).then(e => {
            this.sunSprite = e;
        });
        this._boundingBox = [...props.position, ...props.size];
        this._boundingBoxWPivot = [props.position[0] - props.size[0] * .5, props.position[1] - props.size[1] * .5, ...props.size];
        this.dodo.listener_manager.addEventListener(MOUSE, this.on_click)
    }
    
    tick(delta: number){
        this.rotation += this.properties.degreesPerSecond * delta;
        if(this.rotation > 360000){
            this.rotation = this.rotation % 360000;
        }
        this.scale = 1 + (Math.cos((this.rotation / 1000 * Math.PI / 180) * 7) * .2) / 2;
    }
    
    draw(renderer: Renderer) {
        if(!this.sunSprite) return;
        renderer.context.renderRect("#f00",...this._boundingBoxWPivot);
        renderer.context.drawImageRotated(this.sunSprite, this.rotation / 1000 * Math.PI / 180, PIVOTS.MID_CENTER, this.boundingBox[0], this.boundingBox[1], this.boundingBox[2] * this.scale, this.boundingBox[3] * this.scale);
    }

    on_click = (event: MouseEventData) => {
        if(event.button !== MouseButton.Primary) return;
        if(!point2Rect(event.position, this._boundingBoxWPivot)) return;
        if(this.dodo.currentScene instanceof Game){
            this.dodo.currentScene.currentSun += this.properties.sunAmount;
            this.dodo.currentScene.removeEntity(this);
        }
    }

    dispose(): void{
        this.sunSprite = null;
        this.dodo.listener_manager.removeEventListener(MOUSE, this.on_click)
    }
}