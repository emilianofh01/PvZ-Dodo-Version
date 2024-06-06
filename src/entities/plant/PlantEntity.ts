import Renderer from '../../engine/rendering/Renderer.ts';
import Dodo from '../../engine/Dodo.ts';
import { BoardPieceEntity } from '../BoardPieceEntity.ts';

export interface PlantProperties {
    cooldown: number
}

export abstract class AbstractPlantEntity<P extends PlantProperties> extends BoardPieceEntity {
    abstract get boundingBox(): [number, number, number, number];
    abstract readonly zIndex: number;

    protected dodo: Dodo;

    properties: P;

    cooldownElapsed: number = 0;

    constructor(props: P, dodo: Dodo) {
        super();
        this.properties = props;
        this.dodo = dodo;
        this.cooldownElapsed = this.properties.cooldown;
    }

    override tick(delta: number): void {
        if (this.cooldownElapsed > 0) {
            this.cooldownElapsed -= delta;
            return;
        }
        if (this.fixedTick()) { this.cooldownElapsed = this.properties.cooldown; }
    }

    abstract fixedTick(): boolean;
    abstract draw(renderer: Renderer): void;
    abstract dispose(): void;
}
