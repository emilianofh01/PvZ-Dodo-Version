import { AbstractPlantEntity, PlantProperties } from './PlantEntity.ts';
import Entity from '../Entity.ts';
import Dodo from '../../engine/Dodo.ts';
import { Scene } from '../../engine/scene/Scene.ts';

export interface SunHarvestingPlantProperties extends PlantProperties {
    sunAmount: number
    sunSpawningPoint: [number, number]
}

export abstract class SunHarvestingPlant<T extends SunHarvestingPlantProperties = SunHarvestingPlantProperties> extends AbstractPlantEntity<T> {
    readonly sunProvider: (position: [number, number], sunAmount: number, scene: Scene) => Entity;

    constructor(sunProvider: ((position: [number, number], sunAmount: number, scene: Scene) => Entity), props: T, dodo: Dodo) {
        super(props, dodo);
        this.sunProvider = sunProvider;
    }

    fixedTick() {
        this.dodo.currentScene?.addEntity(this.wrapProvider());
        return true;
    }

    wrapProvider() {
        return (scene: Scene) => this.sunProvider([
            this.boundingBox[0] + this.boundingBox[2] * this.properties.sunSpawningPoint[0],
            this.boundingBox[1] + this.boundingBox[3] * this.properties.sunSpawningPoint[1],
        ], this.properties.sunAmount, scene);
    }
}
