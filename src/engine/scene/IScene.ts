import Renderer from "../../rendering/Renderer";

export default interface IScene {
    preload(): void;
    update(delta: number): void;
    render(renderer: Renderer): void;
}
