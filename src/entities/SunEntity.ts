import Entity from './Entity.ts';
import Dodo from '../engine/Dodo.ts';
import ResourceManagement from '../engine/resource_management/ResourceManager.ts';
import { ASSET_TYPES, AssetKey } from '../engine/resource_management/IResourceLoader.ts';
import Renderer, { PIVOTS } from '../engine/rendering/Renderer.ts';
import { MOUSE, MouseButton, MouseEventData, MouseEventType } from '$/input/mouse.ts';
import { point2Rect } from '$/core/collision.ts';
import { Game } from 'src/game/scenes/Game.ts';
import { lerp } from 'src/utils/interpolation.ts';

export interface SunProperties {
    degreesPerSecond: number
    position: [number, number]
    size: [number, number]
    startPosition?: [number, number]
    endPosition?: [number, number]
    transitionDutarion?: number
    sunAmount: number
    lifetime?: number
}

interface TransitionProps {
    duration: number
    startPos: [number, number]
    endPos: [number, number]
}

export class SunEntity<T extends SunProperties = SunProperties> implements Entity {
    rotation: number;

    properties: T;

    dodo: Dodo;

    sunSprite: CanvasImageSource | null;

    scale: number = 1;

    transition: number = 0;

    transitionData: TransitionProps | null = null;

    _boundingBox: [number, number, number, number];

    _boundingBoxWPivot: [number, number, number, number];

    get boundingBox() {
        return this._boundingBox;
    }

    readonly zIndex = 50;

    readonly lifetime : number;

    timeElapsed: number = 0;

    constructor(props: T, dodo: Dodo) {
        this.properties = props;
        this.rotation = 0;
        this.dodo = dodo;
        this.sunSprite = null;
        this.lifetime = props.lifetime ?? 10000;
        ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, './assets/img/sun.png')).then(e => {
            this.sunSprite = e;
        });
        this._boundingBox = [...props.position, ...props.size];
        this._boundingBoxWPivot = [props.position[0] - props.size[0] * 0.5, props.position[1] - props.size[1] * 0.5, ...props.size];
        this.dodo.listener_manager.addEventListener(MOUSE, this.on_click);
        if ((props.startPosition != null) && (props.endPosition != null) && props.transitionDutarion) {
            this.transitionData = {
                endPos: props.endPosition,
                startPos: props.startPosition,
                duration: props.transitionDutarion,
            };
        }
    }

    tick(delta: number) {
        this.rotation += this.properties.degreesPerSecond * delta;
        if (this.rotation > 360000) {
            this.rotation = this.rotation % 360000;
        }
        this.scale = 1 + (Math.cos((this.rotation / 1000 * Math.PI / 180) * 7) * 0.2) / 2;

        if (this.transitionData != null) {
            this.transition += delta;
            this._boundingBox[0] = lerp(this.transitionData.startPos[0], this.transitionData.endPos[0], this.transition / this.transitionData.duration);
            this._boundingBox[1] = lerp(this.transitionData.startPos[1], this.transitionData.endPos[1], this.transition / this.transitionData.duration);
            if (this.transition > this.transitionData.duration) {
                this.transition = this.transitionData.duration;
                this._boundingBox[0] = this.transitionData.endPos[0];
                this._boundingBox[1] = this.transitionData.endPos[1];
                this.transitionData = null;
            }
            this._boundingBoxWPivot = [this._boundingBox[0] - this._boundingBox[2] * 0.5, this._boundingBox[1] - this._boundingBox[3] * 0.5, this._boundingBox[2], this._boundingBox[3]];
            return;
        }
        this.timeElapsed += delta;
        if (this.timeElapsed > this.lifetime) {
            this.dodo.currentScene?.removeEntity(this);
        }
    }

    draw(renderer: Renderer) {
        if (this.sunSprite == null) return;
        renderer.context.drawImageRotated(this.sunSprite, this.rotation / 1000 * Math.PI / 180, PIVOTS.MID_CENTER, this.boundingBox[0], this.boundingBox[1], this.boundingBox[2] * this.scale, this.boundingBox[3] * this.scale);
    }

    on_click = (event: MouseEventData) => {
        if (!point2Rect(event.position, this._boundingBoxWPivot)) return;
        event.markAsHandled();
        if (event.button !== MouseButton.Primary || event.type != MouseEventType.MouseDown) return;
        if (this.dodo.currentScene instanceof Game) {
            this.dodo.currentScene.currentSun += this.properties.sunAmount;
            this.dodo.currentScene.removeEntity(this);
        }
    };

    dispose(): void {
        this.sunSprite = null;
        this.dodo.listener_manager.removeEventListener(MOUSE, this.on_click);
    }
}
