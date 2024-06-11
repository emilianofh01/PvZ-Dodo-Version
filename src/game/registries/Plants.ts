import { Registry } from '$/core/registry';
import { Scene } from '$/scene/Scene';
import { SunEntity } from 'src/entities/SunEntity';
import { Sunflower } from 'src/entities/plant/Sunflower';
import { GameBoard } from '../entities/board.ts';
import { AbstractPlantEntity } from '../../entities/plant/PlantEntity.ts';
import SPRITESHEETS_REGISTRY from './SpriteSheets.ts';
import { notNullOrUndefined } from 'src/utils/Objects.ts';
import { BoardPieceEntity } from 'src/entities/BoardPieceEntity.ts';
import { PeaShooter } from 'src/entities/plant/PeaShooter.ts';
import { LaneType } from './Levels.ts';
import { SpriteSheet } from '$/sprites/spritesheet.ts';
import { WallNut } from 'src/entities/plant/WallNut.ts';

export interface PlantFactoryProps {
    position: [number, number]
}

export interface SpriteSheetAnimationData {
    sheet: SpriteSheet
    group: string
    fps: number
}

export interface PlantEntry {
    name: string
    description: string
    idleAnimation: SpriteSheetAnimationData
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
    idleAnimation: {
        sheet: notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:sunflower_idle')),
        group: 'default',
        fps: 6,
    },
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
    idleAnimation: {
        sheet: notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:peashooter_idle')),
        group: 'default',
        fps: 10,
    },
    factory(props: PlantFactoryProps, scene: Scene) {
        return new PeaShooter(
            {
                position: props.position,
            },
            scene,
        );
    },
});


PLANTS_REGISTRY.add('dodo:wall_nut', {
    name: 'Wallnut',
    description: 'Wall-nuts have hard shells which you can use to protect your other plants.',
    cost: 50,
    cooldown: 16000,
    canPlant: AND(REQUIRE_EMPTY, (pos, board) => board.laneTypes[pos[1]] === LaneType.Grass),
    idleAnimation: {
        sheet: notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:wall_nut')),
        group: 'default',
        fps: 10,
    },
    factory(props: PlantFactoryProps, scene: Scene) {
        return new WallNut(
            {
                position: props.position,
            },
            scene,
        );
    },
});

export default PLANTS_REGISTRY;
