import Renderer, { PIVOTS } from '$/rendering/Renderer';
import { GameBoard } from 'src/game/entities/board';
import { AbstractZombie } from './AbstractZombie';
import { SpriteSheetAnimation } from '$/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import { AbstractPlantEntity } from '../plant/PlantEntity';
import { LivingEntity } from '../LivingEntity';
import { Scene } from '$/scene/Scene';

export class Zombie extends AbstractZombie {

    walkingAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:zombie_walking')),
        'default',
        3,
    );

    get boundingBox(): [number, number, number, number] {
        return [
            Math.floor(this.position[0] - this.props.size[0] / 2),
            this.position[1] - this.props.size[1],
            ...this.props.size,
        ];
    }

    get collisionBox(): [number, number, number, number] {
        return [
            Math.floor(this.position[0] - this.props.size[0] / 2) + this.props.collisionBox.offset_x,
            this.position[1] - this.props.size[1] + this.props.collisionBox.offset_y,
            this.props.collisionBox.width,
            this.props.collisionBox.height,
        ];
    }

    get detectionPoint(): [number, number] {
        return [this.props.detectionPoint[0] + this.position[0], this.props.detectionPoint[1] + this.position[1]];
    }

    constructor(scene: Scene, board: GameBoard, startPos: [number, number], lane: number) {
        super(
            scene,
            board, 
            {
                biteCooldown: 500,
                damage: 20,
                health: 200,
                size: [ 32, 32 ],
                speed: 6,
                collisionBox: {
                    width: 16,
                    height: 28,
                    offset_x: 5,
                    offset_y: 4,
                },
                detectionPoint: [ -8, -16 ],
            }, 
            startPos,
            lane,
        );
    }

    tick(delta: number): void {
        super.tick(delta);
        if (!this.targetedEntity)
            this.walkingAnim.animate(delta);
    }

    draw(renderer: Renderer): void {
        this.walkingAnim.render(renderer, PIVOTS.BOT_CENTER, ...this.position, ...this.props.size);
    }

    protected onDeath(_damager: LivingEntity<any>, _damageType: string, _amount: number): void {
        this.scene.removeEntity(this);
    }
    
    hasEnteredTheHouse() {
        const pos = this.board.cellAtPos(...this.detectionPoint);
        if (pos[0] < 0) {
            return true;
        }
        return false;
    }

    override checkTarget() {
        const pos = this.board.cellAtPos(...this.detectionPoint);
        if (pos[0] < 0) {
            return false;
        }
        const cell = this.board.getCell(...pos);
        const plant = cell?.find(e => e instanceof AbstractPlantEntity);
        if (plant) {
            this.targetedEntity = plant;
        }
        return !!plant;
    }

}