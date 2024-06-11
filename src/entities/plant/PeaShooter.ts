import { AnimationController } from '$/sprites/animation';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import { AbstractPlantEntity, PlantProperties } from './PlantEntity';
import { Scene } from '$/scene/Scene';
import { BasicProjectile } from './projectiles/BasicProjectile';
import { Game } from 'src/game/scenes/Game';
import { AbstractZombie } from '../zombie/AbstractZombie';

interface PeaShooterProps {
    position: [number, number]
}

export class PeaShooter extends AbstractPlantEntity<PlantProperties> {
    readonly boundingBox: [number, number, number, number];

    idleAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:peashooter_idle')),
        'default',
        10,
    );

    shootingAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:peashooter_shooting')),
        'default',
        36,
    );

    animationController = new AnimationController(this.idleAnim);

    readonly shootingPointOffset: [number, number];

    readonly raycastStart : number;

    readonly raycastEnd : number;

    constructor(props: PeaShooterProps, scene: Scene) {
        super({
            cooldown: 1500,
            health: 100,
        }, scene);
        this.shootingPointOffset = [
            18,
            12,
        ];
        this.boundingBox = [...props.position, 32, 32];
        this.raycastStart = props.position[0] + this.shootingPointOffset[0];
        this.raycastEnd = (scene as Game).spawner.start_x;
    }

    animationSent = false;

    tick(delta: number): void {
        super.tick(delta);
        this.animationController.update(delta);
        if (this.cooldownElapsed <= this.shootingAnim.duration() * .5 && !this.animationSent) {
            if (this.checkZombies()) {
                this.animationController.addToQueue(this.shootingAnim);
                this.animationController.addToQueue(this.idleAnim);
                this.animationController.skip();
                this.animationSent = true;
            }
        }
    }

    checkZombies(): boolean {
        if (this.board == undefined || this.boardPosition == undefined) throw Error('Board or boardPosition not defined');
        const entities = this.board.laneEntities.get(this.boardPosition[1]);
        if (!entities) return false;
        for (const entity of entities) {
            if (entity instanceof AbstractZombie) {
                const box = entity.collisionBox;
                if (box[0] + box[2] > this.raycastStart && box[0] < this.raycastEnd) {
                    return true;
                }
            }
        }
        return false;
    }

    fixedTick(): boolean {
        if (this.board == undefined || this.boardPosition == undefined) throw Error('Board or boardPosition not defined');
        if (!this.checkZombies()) return false;
        this.animationSent = false;
        if (this.board != undefined && this.boardPosition != undefined) {
            const board = this.board;
            const lane = this.boardPosition[1];
            this.scene.addEntity(_scene => new BasicProjectile(
                this.scene,
                board,
                lane,
                [this.boundingBox[0] + this.shootingPointOffset[0], this.boundingBox[1] + this.shootingPointOffset[1]],
                {
                    size: [7, 7],
                    speed: [64, 0],
                    health: 1000,
                    damage: 20,
                    sprite: notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:pea')),
                },
            ));
        }

        return true;
    }

    draw(renderer: Renderer): void {
        this.animationController.render(renderer, PIVOTS.TOP_LEFT, ...this.boundingBox);
    }
}
