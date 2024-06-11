import { Registry } from '$/core/registry';
import { Scene } from '$/scene/Scene';
import { SpriteSheetAnimation } from '$/sprites/animatable';
import { SunEntity } from 'src/entities/SunEntity';
import { Sunflower } from 'src/entities/plant/Sunflower';
import { GameBoard } from '../entities/board.ts';
import { AbstractPlantEntity } from '../../entities/plant/PlantEntity.ts';
import SPRITESHEETS_REGISTRY from './SpriteSheets.ts';
import { notNullOrUndefined } from 'src/utils/Objects.ts';
import { BoardPieceEntity } from 'src/entities/BoardPieceEntity.ts';
import { PeaShooter } from 'src/entities/plant/PeaShooter.ts';
import { LaneType } from './Levels.ts';

export interface PlantFactoryProps {
    position: [number, number]
}

export interface PlantEntry {
    name: string
    description: string
    idleAnimation: SpriteSheetAnimation
    cost: number
    cooldown: number
    canPlant?: (pos: [number, number], board: GameBoard) => boolean
    factory: (props: PlantFactoryProps, scene: Scene) => BoardPieceEntity<any>
}

const AND = (a: (pos: [number, number], board: GameBoard) => boolean, b: (pos: [number, number], board: GameBoard) => boolean) => {
    return (pos: [number, number], board: GameBoard) => a(pos, board) && b(pos, board);
};

const REQUIRE_EMPTY = (pos: [number, number], board: GameBoard) => (board.getCell(...pos)?.find(e => e instanceof AbstractPlantEntity)) == null;

const PLANTS_REGISTRY = new Registry<PlantEntry>();

PLANTS_REGISTRY.add('dodo:sunflower', {
    name: 'Sunflower',
    description: "Sunflower can't resist bouncing to the beat. Which beat is that? Why, the life-giving jazzy rhythm of the Earth itself, thumping at a frequency only Sunflower can hear.",
    cost: 50,
    cooldown: 8000,
    canPlant: AND(REQUIRE_EMPTY, (pos, board) => board.laneTypes[pos[1]] === LaneType.Grass),
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
            scene,
        );
    },
});


PLANTS_REGISTRY.add('dodo:peashooter', {
    name: 'Peashooter',
    description: 'Peashooters are your first line of defense. They shoot peas at attacking zombies.',
    cost: 100,
    cooldown: 8000,
    canPlant: AND(REQUIRE_EMPTY, (pos, board) => board.laneTypes[pos[1]] === LaneType.Grass),
    idleAnimation: new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:peashooter_idle')),
        'default',
        10,
    ),
    factory(props: PlantFactoryProps, scene: Scene) {
        return new PeaShooter(
            {
                position: props.position,
            },
            scene,
        );
    },
});

export default PLANTS_REGISTRY;
