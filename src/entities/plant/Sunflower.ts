import { AnimationController } from '$/sprites/animation';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { Scene } from '../../engine/scene/Scene';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import Entity from '../Entity';
import { SunHarvestingPlant } from './SunHarvestingPlant';
import { notNullOrUndefined } from 'src/utils/Objects';

interface SunflowerProps {
    position: [number, number]
}

export class Sunflower extends SunHarvestingPlant {
    readonly boundingBox: [number, number, number, number];

    sunflowerAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:sunflower_idle')),
        'default',
        6,
    );

    sunflowerGlowAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:sunflower_glow')),
        'default',
        7,
    );

    animationController = new AnimationController(this.sunflowerAnim);

    constructor(sunflowerProps: SunflowerProps, sunProvider: ((position: [number, number], sunAmount: number, scene: Scene) => Entity), scene: Scene) {
        super(sunProvider, {
            cooldown: 20000,
            sunAmount: 25,
            sunSpawningPoint: [0.65, 0.65],
            health: 100,
        }, scene);
        this.boundingBox = [...sunflowerProps.position, 32, 32];
    }

    animationSent = false;

    tick(delta: number): void {
        super.tick(delta);
        this.animationController.update(delta);
        if (this.cooldownElapsed <= this.sunflowerGlowAnim.duration() * .5 && !this.animationSent) {
            this.animationController.addToQueue(this.sunflowerGlowAnim);
            this.animationController.addToQueue(this.sunflowerAnim);
            this.animationController.skip();
            this.animationSent = true;
        }
    }

    fixedTick(): boolean {
        const n = super.fixedTick();
        this.animationSent = false;
        return n;
    }

    draw(renderer: Renderer): void {
        this.animationController.render(renderer, PIVOTS.TOP_LEFT, ...this.boundingBox);
    }
}
