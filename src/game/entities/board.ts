import Entity from "../../entities/Entity.ts";
import Renderer from "$/rendering/Renderer.ts";
import {Scene} from "$/scene/Scene.ts";

export class GameBoard implements Entity {
    readonly zIndex: number = 0;
    readonly position: [number, number];
    readonly cell_size: [number, number];
    readonly board_size: [number, number];
    
    constructor(_: Scene) {
        this.cell_size = [32, 32]; 
        this.board_size = [12, 5];
        this.position = [0, 80];
    }
    
    get boundingBox(): [number, number, number, number] {
        return [...this.position, this.cell_size[0] * this.board_size[0], this.cell_size[0] * this.board_size[0]];
    }
    
    tick(_: number) : void {
        
    }
    
    draw(renderer: Renderer): void {
        for(let i = 0; i < this.board_size[0]; i++) {
            for(let j = 0; j < this.board_size[1]; j++) {
                renderer.context.renderRect((i + j) % 2 ? "#000" : "#fff", this.position[0] + this.cell_size[0] * i, this.position[1] + this.cell_size[1] * j, ...this.cell_size)
            }
        }
    }
    dispose(): void{
        
    }
}