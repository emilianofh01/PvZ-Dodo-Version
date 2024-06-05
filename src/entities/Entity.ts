import Renderer from '../engine/rendering/Renderer';

export default interface Entity {
    readonly zIndex: number
    readonly boundingBox: [number, number, number, number]
    tick: (delta: number) => void
    draw: (renderer: Renderer) => void
    dispose: () => void
}
