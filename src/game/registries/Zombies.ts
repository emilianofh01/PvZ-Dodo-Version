import { Scene } from '$/scene/Scene';
import { SpriteSheetAnimation } from '$/sprites/animatable';
import { AbstractZombie } from 'src/entities/zombie/AbstractZombie';
import { GameBoard } from '../entities/board';
import { Registry } from '$/core/registry';
import { Zombie } from 'src/entities/zombie/Zombie';
import { notNullOrUndefined } from 'src/utils/Objects';
import SPRITESHEETS_REGISTRY from './SpriteSheets';

export interface ZombieFactoryProps {
    position: [number, number]
    gameBoard: GameBoard, 
    lane: number
}

export interface ZombieEntry {
    name: string
    description: string
    idleAnimation: SpriteSheetAnimation
    factory: (props: ZombieFactoryProps, scene: Scene) => AbstractZombie<any>
}

const ZOMBIES_REGISTRY = new Registry<ZombieEntry>();

ZOMBIES_REGISTRY.add('dodo:zombie', {
    name: 'Zombie',
    description: "This zombie loves brains. Can't get enough. Brains, brains, brains, day in and night out. Old and stinky brains? Rotten brains? Brains clearly past their prime? Doesn't matter. Regular zombie wants 'em.",
    factory(props, scene) {
        return new Zombie(scene, props.gameBoard, props.position, props.lane);
    },
    idleAnimation: new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:zombie_walking')),
        'default',
        3,
    ),
});

export  default ZOMBIES_REGISTRY;