import { AnimationController } from '$/sprites/animation';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { Scene } from '../../engine/scene/Scene';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import { AbstractPlantEntity, PlantProperties } from './PlantEntity';

interface SunflowerProps {
    position: [number, number]
}

export class WallNut extends AbstractPlantEntity<PlantProperties> {
    readonly boundingBox: [number, number, number, number];

    normal: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:wall_nut')),
        'default',
        6,
    );

    damaged: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:wall_nut_damaged')),
        'default',
        7,
    );

    heavily_damaged: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:wall_nut_heavily_damaged')),
        'default',
        7,
    );


    animationController = new AnimationController(this.normal);

    constructor(sunflowerProps: SunflowerProps, scene: Scene) {
        super({
            cooldown: 40000,
            health: 4000,
        }, scene);
        this.boundingBox = [...sunflowerProps.position, 32, 32];
    }

    animationSent = false;

    last_anim = 'normal';

    tick(delta: number): void {
        super.tick(delta);
        this.animationController.update(delta);
        if (this.health < 1333) {
            if (this.last_anim != 'heavily_damaged') {
                this.animationController.addToQueue(this.heavily_damaged);
                this.animationController.skip();
                this.last_anim = 'heavily_damaged';
            }
        } else if (this.health < 2667) {
            if (this.last_anim != 'damaged') {
                this.animationController.addToQueue(this.damaged);
                this.animationController.skip();
                this.last_anim = 'damaged';
            }
        }
    }

    fixedTick(): boolean {
        return true;
    }

    draw(renderer: Renderer): void {
        this.animationController.render(renderer, PIVOTS.TOP_LEFT, ...this.boundingBox);
    }
}
