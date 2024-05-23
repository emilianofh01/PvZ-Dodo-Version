export default interface Entity {
    tick(delta: number) : void;
    draw(ctx: CanvasRenderingContext2D): void;
}