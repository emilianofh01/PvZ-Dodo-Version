import { SpriteSheetAnimation } from '$/sprites/animatable';
import { notNullOrUndefined } from 'src/utils/Objects';
import { Zombie } from './Zombie';
import SPRITESHEETS_REGISTRY from 'src/game/registries/SpriteSheets';
import { GameBoard } from 'src/game/entities/board';
import { ZombieProps } from './AbstractZombie';
import { Scene } from '$/scene/Scene';

export class ConeZombie extends Zombie {
    walkingAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:cone_zombie_walking')),
        'default',
        3,
    );

    constructor(scene: Scene, board: GameBoard, startPos: [number, number], lane: number, props?: ZombieProps) {
        super(scene, board, startPos, lane, props ?? {
            biteCooldown: 1000,
            damage: 100,
            health: 551,
            size: [ 32, 32 ],
            speed: 6,
            collisionBox: {
                width: 16,
                height: 28,
                offset_x: 5,
                offset_y: 4,
            },
            detectionPoint: [ -8, -16 ],
        });
    }
}