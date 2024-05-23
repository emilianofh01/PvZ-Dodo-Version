import Renderer from "../../rendering/Renderer";
import Dodo from "../Dodo";
import IScene from "./IScene";


export class Scene implements IScene {
    dodo: Dodo;
    
    constructor(dodo: Dodo){
        this.dodo = dodo;
    }

    preload(): void {
        throw new Error("Method not implemented.");
    }
    update(delta: number): void {
        throw new Error("Method not implemented.");
    }
    render(renderer: Renderer): void {
        throw new Error("Method not implemented.");
    }

}