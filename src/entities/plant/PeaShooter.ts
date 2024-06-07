import { AnimationController } from '$/sprites/animation';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import { AbstractPlantEntity, PlantProperties } from './PlantEntity';
import { Scene } from '$/scene/Scene';

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

    constructor(props: PeaShooterProps, scene: Scene) {
        super({
            cooldown: 1500,
            health: 100,
        }, scene);
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
}
