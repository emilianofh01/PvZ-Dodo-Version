import { Registry } from '$/core/registry';
import { Scene } from '$/scene/Scene';
import { randomInt } from 'src/utils/random';
import { PlantPlacementData } from '../entities/board';
import { Game } from '../scenes/Game';
import PLANTS_REGISTRY, { PlantEntry } from './Plants';
import ZOMBIES_REGISTRY, { ZombieEntry } from './Zombies';
import { notNullOrUndefined } from 'src/utils/Objects';

export interface ZombieGeneration {
    zombie: ZombieEntry;
    selectLane: (scene: Scene) => number;
}

export interface StartLevelCondition {
    readonly condition: string;
    check(scene: Game): boolean;
    onPlant(event: PlantPlacementData): boolean;
    tick(delay: number): boolean;
}

class PlacePlantCondition implements StartLevelCondition {
    readonly condition: string = 'dodo:place_plant';

    readonly ammountToPlace: number;

    readonly plantToPlace: PlantEntry;

    private plantsPlaced = 0;

    constructor(plant: PlantEntry, plantsToPlace: number = 1) {
        this.ammountToPlace = plantsToPlace;
        this.plantToPlace = plant;
    }

    check(_scene: Game): boolean {
        return this.plantsPlaced >= this.ammountToPlace;
    }

    onPlant(event: PlantPlacementData): boolean {
        if (this.plantToPlace == event.plant) {
            this.plantsPlaced++;
            return true;
        }
        return false;
    }

    tick(_delay: number): boolean { 
        return false;
    }
}

class DelayAfterCondition implements StartLevelCondition {
    readonly condition: string = 'dodo:place_plant';
    
    readonly delay: number;

    timeElapsed: number = 0;

    readonly conditionBefore: StartLevelCondition;

    checkedBefore = false;

    constructor(condition: StartLevelCondition, delay: number) {
        this.conditionBefore = condition;
        this.delay = delay;
    }

    onPlant(event: PlantPlacementData): boolean {
        if (this.checkedBefore) 
            return false;
        return this.conditionBefore.onPlant(event);
    }

    tick(delta: number) {
        if (this.checkedBefore) {
            this.timeElapsed += delta;
            return this.timeElapsed >= this.delay;
        }
        return this.conditionBefore.tick(delta);
    }
    
    check(_scene: Game): boolean {
        if (this.checkedBefore) return this.timeElapsed >= this.delay;
        if (this.conditionBefore.check(_scene)) {
            this.checkedBefore = true;
        }
        return this.timeElapsed >= this.delay;
    }
}

export interface Wave {
    time: number
    batch: ZombieGeneration[]
}

export interface PlantReward {
    type: 'plant',
    reward: PlantEntry
}

export type RewardData = PlantReward;

export interface Level {
    startingSuns: number
    fixedSeeds: PlantEntry[]
    spacing: number
    lanes: LaneType[]
    waves: Wave[]
    startLevelConditions?: StartLevelCondition[]
    reward?: RewardData
}

export enum LaneType {
    Ground,
    Grass,
}

export const LEVELS_REGISTRY = new Registry<Level>();
LEVELS_REGISTRY.add('dodo:level_1-1', {
    reward: {
        type: 'plant',
        reward: notNullOrUndefined(PLANTS_REGISTRY.get('dodo:sunflower')),
    },
    startingSuns: 150,
    fixedSeeds: [
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:peashooter')),
    ],
    startLevelConditions: [
        new DelayAfterCondition(new PlacePlantCondition(notNullOrUndefined(PLANTS_REGISTRY.get('dodo:peashooter')), 2), 5000),
    ],
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
            time: 0,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 10000,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 20000,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 30000,
            batch: [
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => 2, zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
    ],
});

LEVELS_REGISTRY.add('dodo:level_1-2', {
    startingSuns: 50,
    fixedSeeds: [
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:peashooter')),
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:sunflower')),
    ],
    startLevelConditions: [
        new DelayAfterCondition(new PlacePlantCondition(notNullOrUndefined(PLANTS_REGISTRY.get('dodo:sunflower')), 3), 16000),
    ],
    spacing: 10,
    lanes: [
        LaneType.Ground,
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Ground,
    ],
    waves: [
        {
            time: 0,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 30000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 60000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 90000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 120000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 150000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
    ],
});

LEVELS_REGISTRY.add('dodo:level_1-3', {
    startingSuns: 50,
    fixedSeeds: [
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:peashooter')),
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:sunflower')),
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:cherry_bomb')),
    ],
    startLevelConditions: [
    ],
    spacing: 10,
    lanes: [
        LaneType.Ground,
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Ground,
    ],
    waves: [
        {
            time: 0,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 30000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 60000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 90000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie_cone')) },
            ],
        },
        {
            time: 120000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie_cone')) },
            ],
        },
        {
            time: 150000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 180000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie_cone')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        
        {
            time: 210000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie_cone')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
    ],
});

LEVELS_REGISTRY.add('dodo:level_1-4', {
    startingSuns: 50,
    fixedSeeds: [
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:peashooter')),
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:sunflower')),
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:cherry_bomb')),
        notNullOrUndefined(PLANTS_REGISTRY.get('dodo:wall_nut')),
    ],
    startLevelConditions: [
    ],
    spacing: 10,
    lanes: [
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Grass,
        LaneType.Grass,
    ],
    waves: [
        {
            time: 0,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 30000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 60000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 90000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 120000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 150000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 180000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 210000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        {
            time: 240000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
            ],
        },
        
        {
            time: 270000,
            batch: [
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie_cone')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie')) },
                { selectLane: () => randomInt(1, 4), zombie: notNullOrUndefined(ZOMBIES_REGISTRY.get('dodo:zombie_cone')) },
            ],
        },
    ],
});