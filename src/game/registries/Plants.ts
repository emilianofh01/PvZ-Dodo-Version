import { Registry } from '$/core/registry';
import { Scene } from '$/scene/Scene';
import { SpriteSheetAnimation } from '$/sprites/animatable';
import Entity from 'src/entities/Entity';
import { SunEntity } from 'src/entities/SunEntity';
import { Sunflower } from 'src/entities/plant/Sunflower';
import { GameBoard } from '../entities/board.ts';
import { AbstractPlantEntity } from '../../entities/plant/PlantEntity.ts';
import SPRITESHEETS_REGISTRY from './SpriteSheets.ts';
import { notNullOrUndefined } from 'src/utils/Objects.ts';

export interface PlantFactoryProps {
    position: [number, number]
}

export interface PlantEntry {
    name: string
    description: string
    idleAnimation: SpriteSheetAnimation
    cost: number
    canPlant?: (pos: [number, number], board: GameBoard) => boolean
    factory: (props: PlantFactoryProps, scene: Scene) => Entity
}

const REQUIRE_EMPTY = (pos: [number, number], board: GameBoard) => (board.gridMap.get(pos[0])?.get(pos[1])?.find(e => e instanceof AbstractPlantEntity)) == null;

const PLANTS_REGISTRY = new Registry<PlantEntry>();

PLANTS_REGISTRY.add('dodo:sunflower', {
    name: 'Sunflower',
    description: "Sunflower can't resist bouncing to the beat. Which beat is that? Why, the life-giving jazzy rhythm of the Earth itself, thumping at a frequency only Sunflower can hear.",
    cost: 50,
    canPlant: REQUIRE_EMPTY,
    idleAnimation: new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:sunflower_idle')),
        'default',
        6,
    ),
    factory(props: PlantFactoryProps, scene: Scene) {
        return new Sunflower(
            {
                position: props.position,
            },
            (position, sunAmount, constructorScene) => new SunEntity({ degreesPerSecond: 90, position, size: [32, 32], sunAmount }, constructorScene.dodo),
            scene.dodo,
        );
    },
});

export default PLANTS_REGISTRY;
