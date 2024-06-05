import Entity from '../../entities/Entity.ts';
import Renderer from '$/rendering/Renderer.ts';
import { Scene } from '$/scene/Scene.ts';
import { PlantEntry, PlantFactoryProps } from '../registries/Plants.ts';
import { MouseEventData } from '$/input/mouse.ts';

export class GameBoard implements Entity {
    readonly zIndex: number = 0;

    readonly position: [number, number];

    readonly cell_size: [number, number];

    readonly board_size: [number, number];

    highlightedCell: [number, number] | null = null;

    readonly gridMap: Map<number | null, Map<number | null, Entity[]>> = new Map();

    readonly scene: Scene;

    get boundingBox(): [number, number, number, number] {
        return [...this.position, this.cell_size[0] * this.board_size[0], this.cell_size[0] * this.board_size[0]];
    }

    constructor(scene: Scene) {
        this.cell_size = [32, 32];
        this.board_size = [12, 5];
        this.position = [0, 80];
        this.scene = scene;
    }

    mousePosUpdate(pos: [number, number]) {
        this.highlightedCell = [
            Math.floor(pos[0] / this.cell_size[0]),
            Math.floor(pos[1] / this.cell_size[1]),
        ];
    }

    takeAction(event: MouseEventData, card: PlantEntry): boolean {
        const cell: [number, number] = [
            Math.floor((event.position[0] - this.position[0]) / this.cell_size[0]),
            Math.floor((event.position[1] - this.position[1]) / this.cell_size[1]),
        ];

        if ((card.canPlant != null) && !card.canPlant(cell, this)) {
            return false;
        }

        const plant = this.scene.addEntity(
            scene => card.factory({
                position: [
                    this.position[0] + this.cell_size[0] * cell[0],
                    this.position[1] + this.cell_size[1] * cell[1],
                ],
            }, scene),
        );
        const row = this.gridMap.get(cell[0]) ?? new Map<number | null, Entity[]>();
        const arr = row.get(cell[1]) ?? [];
        arr.push(plant);
        if (row.get(cell[1]) == null) {
            row.set(cell[1], arr);
        }
        if (this.gridMap.get(cell[0]) == null) {
            this.gridMap.set(cell[0], row);
        }
        return true;
    }

    placePlant(pos: [number, number], plantConstructor: ((props: PlantFactoryProps, scene: Scene) => Entity)) {
        plantConstructor({
            position: [
                pos[0] * this.cell_size[0] + this.position[0],
                pos[0] * this.cell_size[1] + this.position[1],
            ],
        }, this.scene);
    }

    tick(_: number): void {

    }

    draw(renderer: Renderer): void {
        for (let i = 0; i < this.board_size[0]; i++) {
            for (let j = 0; j < this.board_size[1]; j++) {
                renderer.context.renderRect((i + j) % 2 ? '#000' : '#fff', this.position[0] + this.cell_size[0] * i, this.position[1] + this.cell_size[1] * j, ...this.cell_size);
                if ((this.highlightedCell == null) || this.highlightedCell[0] != i || this.highlightedCell[1] != j) continue;
                renderer.context.renderRect('#aaa', this.position[0] + this.cell_size[0] * i, this.position[1] + this.cell_size[1] * j, ...this.cell_size);
            }
        }
    }

    dispose(): void {

    }
}
