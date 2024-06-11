import { MOUSE, MouseEventData, MouseEventType } from '$/input/mouse';
import Renderer, { PIVOTS } from '$/rendering/Renderer';
import { SpriteSheet } from '$/sprites/spritesheet';
import Entity from 'src/entities/Entity';
import { lerp } from 'src/utils/interpolation';
import SPRITESHEETS_REGISTRY from '../registries/SpriteSheets';
import { notNullOrUndefined } from 'src/utils/Objects';
import { PlantReward, RewardData } from '../registries/Levels';
import { Game } from '../scenes/Game';

export class Reward implements Entity {
    readonly rewardFrame: SpriteSheet = notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:reward'));

    readonly drawReward: (renderer: Renderer, pos: [number, number]) => void;

    readonly zIndex: number = 100;

    boundingBox: [number, number, number, number];
    
    readonly scene: Game;

    readonly animationDuration = 2000;

    position:[number, number];
    
    animationElapsed = 0;

    pickedUp = false;

    startPos?: [number, number];

    endPos?: [number, number];

    rewardData: RewardData;


    constructor(scene: Game, position: [number, number], rewardData: RewardData) {
        this.position = position;
        this.rewardData = rewardData;
        if (rewardData.type == 'plant') {
            this.drawReward = (renderer, pos) => {
                (rewardData as PlantReward).reward.idleAnimation.sheet.drawImagePivoted(renderer.context, (rewardData as PlantReward).reward.idleAnimation.group, 0, PIVOTS.MID_CENTER, ...pos);
            };
        } else {
            this.drawReward = () => {};
        }
        this.boundingBox = [
            position[0] - (36 / 2),
            position[1] - (36 / 2),
            36,
            36,
        ];
        this.scene = scene;
        scene.dodo.listener_manager.addEventListener(MOUSE, this.click);
    }


    click = (event: MouseEventData) => {
        if (event.type == MouseEventType.MouseClick) {
            this.pickedUp = true;
            this.startPos = [ ...this.position ];
            this.endPos = [ this.scene.dodo.canvas.width / 2, this.scene.dodo.canvas.height / 2 ];
        }
    };

    tick(delta: number):void {
        if (!this.pickedUp) return;
        if (this.animationElapsed >= this.animationDuration) return;
        this.animationElapsed += delta;
        if (this.animationElapsed / this.animationDuration >= 1) {
            this.position[0] = this.endPos![0];
            this.position[1] = this.endPos![1];
            this.boundingBox = [
                Math.floor(this.position[0] - (36 / 2)),
                Math.floor(this.position[1] - (36 / 2)),
                36,
                36,
            ];
            this.scene.pvz.nextLevel();
            return;
        }
        this.position[0] = lerp(this.startPos![0], this.endPos![0], this.animationElapsed / this.animationDuration);
        this.position[1] = lerp(this.startPos![1], this.endPos![1], this.animationElapsed / this.animationDuration);
        this.boundingBox = [
            Math.floor(this.position[0] - (36 / 2)),
            Math.floor(this.position[1] - (36 / 2)),
            36,
            36,
        ];
    }

    draw(renderer: Renderer): void {
        renderer.context.clear(`rgba(0, 0, 0, ${this.animationElapsed / this.animationDuration})`);
        this.rewardFrame.drawImage(renderer.context, 'default', 0, ...this.boundingBox);
        this.drawReward(renderer, [ this.boundingBox[0] + this.boundingBox[2] / 2, this.boundingBox[1] + this.boundingBox[3] / 2 ]);
    }
    
    dispose(): void {
        this.scene.dodo.listener_manager.removeEventListener(MOUSE, this.click);
    }
    
}