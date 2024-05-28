import Renderer, { BackdropFill } from "../rendering/Renderer";
import {Scene} from "./Scene.ts";
import Entity from "../../entities/Entity.ts";

export default interface IScene {
    readonly fill: BackdropFill;

    preload(): Promise<void>;
    update(delta: number): void;
    render(renderer: Renderer): void;
    dispose(): void;
    addEntity(provider: (scene: Scene) => Entity): void;
}
