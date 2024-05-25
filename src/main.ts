import Dodo from "./engine/Dodo";
import Renderer from "./engine/rendering/Renderer";
import { Scene } from "./engine/scene/Scene";
import Entity from "./entities/Entity";
import {MOUSE_MOVE, MouseMoveEventData} from "./engine/input/mouse_movement.ts";

const dodo = new Dodo(document.getElementsByTagName("canvas")[0]);

class CursorEntity implements Entity{
    private scene: Scene;
    get boundingBox(): [number,number,number,number]{
        return [...this.pos, 9, 9]
    }
    pos: [number, number] = [0, 0];
    mouse_pos: [number, number] = [0, 0];

    listener = (event: MouseEvent) => this.mouse_pos = [event.pageX - 4, event.pageY - 4];

    constructor(scene: Scene){
        this.scene = scene;
        this.scene.dodo.listener_manager.addEventListener(MOUSE_MOVE, this.onMouseMove);
    }

    onMouseMove = (data: MouseMoveEventData) =>{
        this.mouse_pos = data.position;
    }

    dispose(): void {
        this.scene.dodo.listener_manager.removeEventListener(MOUSE_MOVE, this.onMouseMove);
    }

    tick(_: number): void {
        this.pos = [this.mouse_pos[0] - 4, this.mouse_pos[1] - 4];
    }

    draw(renderer: Renderer): void {
        renderer.context.renderRect("#000", this.pos[0], this.pos[1], 9, 9);
    }

}

class TestScene extends Scene{
    constructor(dodo: Dodo){
        super(dodo);
        this.addEntity(e => new CursorEntity(e))
    }
}

dodo.transitionTo(e => new TestScene(e));
dodo.render()

const loop_fn = (a: number) => {
    dodo.loop(a);
    window.requestAnimationFrame(loop_fn);
}
window.requestAnimationFrame(loop_fn);