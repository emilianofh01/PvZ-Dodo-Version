import Renderer, { BackdropFill } from "../rendering/Renderer";

export default interface IScene {
    readonly fill: BackdropFill;

    preload(): Promise<void>;
    update(delta: number): void;
    render(renderer: Renderer): void;
    dispose(): void;
}
