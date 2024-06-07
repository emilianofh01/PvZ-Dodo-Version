import Entity from 'src/entities/Entity';
import { Registry } from '$/core/registry';
import { Scene } from '$/scene/Scene';
import { GameBoard } from '../entities/board';
import { Zombie } from 'src/entities/zombie/Zombie';

export interface ZombieGeneration {
    generate: (pos: [number, number], scene: Scene, gameBoard: GameBoard, lane: number) => Entity;
    selectLane: (scene: Scene) => number;
}

export interface Wave {
    time: number
    zombiesToGenerate: ZombieGeneration[]
}

export interface Level {
    spacing: number;
    lanes: LaneType[];
    waves: Wave[]
}

export enum LaneType {
    Ground,
    Grass,
}

export const LEVELS_REGISTRY = new Registry<Level>();
LEVELS_REGISTRY.add('dodo:level_1-1', {
    spacing: 10,
    lanes: [
        LaneType.Ground,
        LaneType.Ground,
        LaneType.Grass,
        LaneType.Ground,
        LaneType.Ground,
    ],
    waves: [
        {
            time: 30000,
            zombiesToGenerate: [
                { selectLane: () => 2, generate: (pos: [number, number], scene: Scene, gameBoard: GameBoard, lane: number) => new Zombie(scene, gameBoard, pos, lane) },
            ],
        },
        {
            time: 40000,
            zombiesToGenerate: [
                { selectLane: () => 2, generate: (pos: [number, number], scene: Scene, gameBoard: GameBoard, lane: number) => new Zombie(scene, gameBoard, pos, lane) },
            ],
        },
        {
            time: 50000,
            zombiesToGenerate: [
                { selectLane: () => 2, generate: (pos: [number, number], scene: Scene, gameBoard: GameBoard, lane: number) => new Zombie(scene, gameBoard, pos, lane) },
            ],
        },
        {
            time: 65000,
            zombiesToGenerate: [
                { selectLane: () => 2, generate: (pos: [number, number], scene: Scene, gameBoard: GameBoard, lane: number) => new Zombie(scene, gameBoard, pos, lane) },
                { selectLane: () => 2, generate: (pos: [number, number], scene: Scene, gameBoard: GameBoard, lane: number) => new Zombie(scene, gameBoard, pos, lane) },
            ],
        },
    ],
});

