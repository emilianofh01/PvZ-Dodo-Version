import { AnimationController } from '$/sprites/animation';
import Dodo from '../../engine/Dodo';
import Renderer, { PIVOTS } from '../../engine/rendering/Renderer';
import { loadImage } from '../../engine/resource_management/ResourceManager';
import { Scene } from '../../engine/scene/Scene';
import { SpriteSheetAnimation } from '../../engine/sprites/animatable';
import { SpriteSheet } from '../../engine/sprites/spritesheet';
import Entity from '../Entity';
import { SunHarvestingPlant } from './SunHarvestingPlant';

interface SunflowerProps {
    position: [number, number]
}

export class Sunflower extends SunHarvestingPlant {
    readonly boundingBox: [number, number, number, number];

    sunflowerAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        new SpriteSheet(
            loadImage('./assets/img/sunflower_idle.png'),
            {
                groups: [
                    {
                        cell_size: [32, 32],
                        grid_size: [2, 3],
                        name: 'default',
                        padding: [0, 0],
                        x: 0,
                        y: 0,
                        frames: 6,
                    },
                ],
            },
        ),
        'default',
        6,
    );

    sunflowerGlowAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        new SpriteSheet(
            loadImage('./assets/img/sunflower_glow.png'),
            {
                groups: [
                    {
                        cell_size: [32, 32],
                        grid_size: [3, 3],
                        name: 'default',
                        padding: [0, 0],
                        x: 0,
                        y: 0,
                        frames: 7,
                    },
                ],
            },
        ),
        'default',
        7,
    );

    animationController = new AnimationController(this.sunflowerAnim);

    zIndex: number = 0;

    constructor(sunflowerProps: SunflowerProps, sunProvider: ((position: [number, number], sunAmount: number, scene: Scene) => Entity), dodo: Dodo) {
        super(sunProvider, {
            cooldown: 20000,
            sunAmount: 25,
            sunSpawningPoint: [0.65, 0.65],
        }, dodo);
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

    dispose(): void {
    }
}
