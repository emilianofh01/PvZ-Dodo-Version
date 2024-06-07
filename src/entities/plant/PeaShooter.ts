import { AnimationController } from '$/sprites/animation';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import Dodo from '../../engine/Dodo';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import { AbstractPlantEntity, PlantProperties } from './PlantEntity';

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
        9,
    );

    animationController = new AnimationController(this.idleAnim);

    zIndex: number = 0;

    constructor(props: PeaShooterProps, dodo: Dodo) {
        super({
            cooldown: 1500,
            health: 100,
        }, dodo);
        this.boundingBox = [...props.position, 32, 32];
    }

    animationSent = false;

    tick(delta: number): void {
        super.tick(delta);
        this.animationController.update(delta);
    }

    fixedTick(): boolean {
        return true;
    }

    draw(renderer: Renderer): void {
        this.animationController.render(renderer, PIVOTS.TOP_LEFT, ...this.boundingBox);
    }

    dispose(): void {
    }
}
