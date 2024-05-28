import Entity from "./Entity.ts";
import Dodo from "../engine/Dodo.ts";
import ResourceManagement from "../engine/resource_management/ResourceManager.ts";
import {ASSET_TYPES, AssetKey} from "../engine/resource_management/IResourceLoader.ts";
import Renderer, {PIVOTS} from "../engine/rendering/Renderer.ts";

export interface SunProperties {
    degreesPerSecond: number
    position: [number, number]
    size: [number, number]
}

export class SunEntity<T extends SunProperties = SunProperties> implements Entity {
    rotation: number;
    properties: T;
    dodo: Dodo;
    sunSprite: CanvasImageSource | null;
    scale: number = 1;
    
    _boundingBox: [number,number,number,number];
    
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
    }
    
    tick(delta: number){
        this.rotation += this.properties.degreesPerSecond * delta;
        if(this.rotation > 360000){
            this.rotation = this.rotation % 360000;
        }
        this.scale = 1 + (Math.cos(this.rotation / 1000 * Math.PI / 180) * .2) / 2;
    }
    
    draw(renderer: Renderer) {
        if(!this.sunSprite) return;
        const scales = [1, 1, this.scale, this.scale];
        renderer.context.drawImageRotated(this.sunSprite, this.rotation / 1000 * Math.PI / 180, PIVOTS.MID_CENTER, ...this.boundingBox.map((e, i) => e * scales[i]));
    }
    
    dispose(): void{
        this.sunSprite = null;
    }
}