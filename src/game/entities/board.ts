import Entity from '../../entities/Entity.ts';
import Renderer from '$/rendering/Renderer.ts';
import { Scene } from '$/scene/Scene.ts';
import { PlantEntry, PlantFactoryProps } from '../registries/Plants.ts';
import { MouseEventData } from '$/input/mouse.ts';
import { BoardPieceEntity } from 'src/entities/BoardPieceEntity.ts';
import { LaneType } from '../registries/Levels.ts';
import { SpriteSheet } from '$/sprites/spritesheet.ts';
import { notNullOrUndefined } from 'src/utils/Objects.ts';
import SPRITESHEETS_REGISTRY from '../registries/SpriteSheets.ts';
import { MappedEventTarget } from '$/core/event_target.ts';

export interface PlantPlacementData {
    cellX: number;
    cellY: number;
    plant: PlantEntry;
}

export type GameBoardEventMap  = {
    'plantplaced': CustomEvent<PlantPlacementData>;
};


export class GameBoard extends MappedEventTarget<GameBoardEventMap> implements Entity {
    readonly zIndex: number = 0;

    readonly position: [number, number];

    readonly cell_size: [number, number];

    readonly board_size: [number, number];

    highlightedCell: [number, number] | null = null;

    selectedPlant: PlantEntry | null = null;

    private readonly gridMap: Map<number | null, Map<number | null, BoardPieceEntity<any>[]>> = new Map();

    readonly laneEntities: Map<number, Entity[]> = new Map();

    readonly scene: Scene;

    readonly spriteSheet: SpriteSheet = notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:grass'));

    readonly laneTypes: LaneType[];

    get boundingBox(): [number, number, number, number] {
        return [...this.position, this.cell_size[0] * this.board_size[0], this.cell_size[0] * this.board_size[0]];
    }

    constructor(scene: Scene, laneTypes: LaneType[]) {
        super();
        this.cell_size = [32, 32];
        this.board_size = [12, laneTypes.length];
        this.laneTypes = laneTypes;
        this.position = [0, 80];
        this.scene = scene;
    }

    mousePosUpdate(pos: [number, number], selectedPlant: PlantEntry) {
        this.highlightedCell = [
            Math.floor(pos[0] / this.cell_size[0]),
            Math.floor(pos[1] / this.cell_size[1]),
        ];
        this.selectedPlant = selectedPlant;
    }

    takeAction(event: MouseEventData, card: PlantEntry): boolean {
        const cell: [number, number] = [
            Math.floor((event.position[0] - this.position[0]) / this.cell_size[0]),
            Math.floor((event.position[1] - this.position[1]) / this.cell_size[1]),
        ];

        if ((card.canPlant != null) && !card.canPlant(cell, this)) {
            return false;
        }

        const row = this.gridMap.get(cell[0]) ?? new Map<number | null, BoardPieceEntity<any>[]>();
        const arr = row.get(cell[1]) ?? [];
        if (row.get(cell[1]) == null) {
            row.set(cell[1], arr);
        }
        if (this.gridMap.get(cell[0]) == null) {
            this.gridMap.set(cell[0], row);
        }
        
        const plant = this.placePlant(cell, card.factory);
        arr.push(plant);
        
        const eventData : PlantPlacementData = {
            cellX: cell[0],
            cellY: cell[1],
            plant: card,
        };

        this.dispatchEvent(new CustomEvent<PlantPlacementData>('plantplaced', {
            detail: eventData,
        }));

        return true;
    }

    placePlant(pos: [number, number], plantConstructor: ((props: PlantFactoryProps, scene: Scene) => BoardPieceEntity<any>)) {
        const plant = this.scene.addEntity(scene => plantConstructor(
            {
                position: [
                    pos[0] * this.cell_size[0] + this.position[0],
                    pos[1] * this.cell_size[1] + this.position[1],
                ],
            }, 
            scene,
        ));
        plant.initBoard(this, pos);
        return plant;
    }

    cellAtPos(x: number, y: number): [number, number] {
        return [
            Math.floor((x - this.position[0]) / this.cell_size[0]),
            Math.floor((y - this.position[1]) / this.cell_size[1]),
        ];
    }

    getCell(xi: number, yi: number): BoardPieceEntity<any>[] | null {
        return this.gridMap.get(xi)?.get(yi) ?? null;
    }

    addEntityToLane(lane: number, entity: Entity) {
        if (this.laneEntities.has(lane))
            this.laneEntities.get(lane)?.push(entity);
        else 
            this.laneEntities.set(lane, [entity]);
    }

    removeEntityFromLane(lane: number, entity: Entity) {
        const n = this.laneEntities.get(lane) ?? [];
        this.laneEntities.set(lane, n.filter(e => e != entity));
    }

    getEntitiesOfLane(lane: number) {
        return this.laneEntities.get(lane) ?? [];
    }

    tick(_: number): void {

    }

    draw(renderer: Renderer): void {
        for (let i = 0; i < this.board_size[0]; i++) {
            for (let j = 0; j < this.board_size[1]; j++) {
                const variant = (i + j) % 2;                
                this.spriteSheet.drawImage(renderer.context, 'default', variant, this.position[0] + this.cell_size[0] * i, this.position[1] + this.cell_size[1] * j);
                if (this.laneTypes[j] == LaneType.Ground) {
                    this.spriteSheet.drawImage(renderer.context, 'default', 2, this.position[0] + this.cell_size[0] * i, this.position[1] + this.cell_size[1] * j);
                }
                if ((this.highlightedCell == null) || this.highlightedCell[0] != i || this.highlightedCell[1] != j) continue;
                if (this.selectedPlant && (!this.selectedPlant.canPlant || this.selectedPlant.canPlant(this.highlightedCell, this)))
                    renderer.context.renderRect('#0002', this.position[0] + this.cell_size[0] * i, this.position[1] + this.cell_size[1] * j, ...this.cell_size);
            }
        }
    }

    disposeEntity(x: number, y: number, entity: BoardPieceEntity<any>): void {
        const arr = this.gridMap.get(x)?.get(y);
        if (arr) {
            this.gridMap.get(x)?.set(y, arr.filter(e => e != entity));
        }
    }

    dispose(): void {

    }

}
