import { Registry } from '$/core/registry';
import { Scene } from '$/scene/Scene';
import ZOMBIES_REGISTRY, { ZombieEntry } from './Zombies';
import { notNullOrUndefined } from 'src/utils/Objects';

export interface ZombieGeneration {
    zombie: ZombieEntry;
    selectLane: (scene: Scene) => number;
}

export interface Wave {
    time: number
    batch: ZombieGeneration[]
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
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 40000,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 50000,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 65000,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
    ],
});

