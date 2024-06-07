import Renderer from '../../engine/rendering/Renderer.ts';
import Dodo from '../../engine/Dodo.ts';
import { BoardPieceEntity } from '../BoardPieceEntity.ts';
import { LivingEntityProps } from '../LivingEntity.ts';
import { Scene } from '$/scene/Scene.ts';

export interface PlantProperties extends LivingEntityProps {
    cooldown: number
}

export abstract class AbstractPlantEntity<P extends PlantProperties> extends BoardPieceEntity<P> {
    abstract get boundingBox(): [number, number, number, number];
    readonly zIndex: number = 5;

    protected dodo: Dodo;

    cooldownElapsed: number = 0;

    constructor(props: P, scene: Scene) {
        super(scene, props);
        this.dodo = scene.dodo;
        this.cooldownElapsed = this.props.cooldown;
    }

    override tick(delta: number): void {
        if (this.cooldownElapsed > 0) {
            this.cooldownElapsed -= delta;
            return;
        }
        if (this.fixedTick()) { this.cooldownElapsed = this.props.cooldown; }
    }

    abstract fixedTick(): boolean;
    abstract draw(renderer: Renderer): void;
}
