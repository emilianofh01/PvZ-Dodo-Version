import Dodo from '$/Dodo';
import MainScene from './scenes/MainScene.ts';

export class PlantsVsZombies {
    readonly dodo: Dodo;

    constructor(canvas: HTMLCanvasElement) {
        this.dodo = new Dodo(canvas);
    }

    loop = (time: number) => {
        this.dodo.loop(time);
        window.requestAnimationFrame(this.loop);
    };

    run() {
        this.dodo.transitionTo(e => new MainScene(e));
        this.dodo.render();
        this.loop(0);
    }
}
