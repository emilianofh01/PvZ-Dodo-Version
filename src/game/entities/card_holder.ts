import Renderer, { PIVOTS } from "$/rendering/Renderer";
import Entity from "src/entities/Entity";
import PLANTS_REGISTRY from "../registries/Plants";

export class CardHolder implements Entity{
    readonly zIndex: number = 0;
    readonly boundingBox: [number, number, number, number] = [64, 8, 312, 64];
    readonly cardSize: [number, number] = [49, 64];
    readonly cards = [
        ...PLANTS_REGISTRY.getAll(),
    ];
    readonly cardPadding = 8;

    constructor(){

    }

    tick(delta: number): void {
        this.cards.forEach(e => e.idleAnimation.animate(delta));
    }
    
    draw(renderer: Renderer): void {
        renderer.context.renderRect("#fff", ...this.boundingBox);
        this.cards.forEach((e, i) => {
            renderer.context.renderRect("#f00", this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1], ...this.cardSize)
            renderer.context.renderRect("#d00", this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1], this.cardSize[0], this.cardSize[0])
            e.idleAnimation.render(renderer, PIVOTS.MID_CENTER, this.boundingBox[0] + this.cardSize[0] / 2, this.boundingBox[1] + this.cardSize[0] / 2)
            
            renderer.context.textAlign = "center";
            renderer.context.textBaseline = "bottom";
            renderer.context.fillStyle = "#000";
            renderer.context.font = "16px pixel";
            renderer.context.textRendering = "geometricPrecision";
            renderer.context.fillText(e.cost.toFixed(), this.boundingBox[0] + (this.cardSize[0] + 1) / 2, this.boundingBox[1] + this.cardSize[1]);
        })
    }

    dispose(): void {
    }
    
}