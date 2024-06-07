import { AnimationController } from '$/sprites/animation';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import { AbstractPlantEntity, PlantProperties } from './PlantEntity';
import { Scene } from '$/scene/Scene';
import { BasicProjectile } from './projectiles/BasicProjectile';

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
    }

    animationSent = false;

    tick(delta: number): void {
        super.tick(delta);
        this.animationController.update(delta);
        if (this.cooldownElapsed <= this.shootingAnim.duration() * .5 && !this.animationSent) {
            this.animationController.addToQueue(this.shootingAnim);
            this.animationController.addToQueue(this.idleAnim);
            this.animationController.skip();
            this.animationSent = true;
        }
    }

    fixedTick(): boolean {
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
