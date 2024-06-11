import Dodo from '$/Dodo';
import { World } from './registries/Worlds.ts';
import { Game } from './scenes/Game.ts';
import MainScene from './scenes/MainScene.ts';

export class PlantsVsZombies {
    readonly dodo: Dodo;

    currentWorld?: World;

    currentLevelIndex?: number;

    constructor(canvas: HTMLCanvasElement) {
        this.dodo = new Dodo(canvas);
    }

    loadLevel(world: World, index: number) {
        this.currentWorld = world;
        this.currentLevelIndex = index;
        this.dodo.transitionTo((dodo: Dodo) => new Game(dodo, this.currentWorld!.levels[this.currentLevelIndex!], this));
    }

    restartLevel() {
        if (!this.currentWorld || !this.currentLevelIndex) return;
        this.dodo.transitionTo((dodo: Dodo) => new Game(dodo, this.currentWorld!.levels[this.currentLevelIndex!], this));
    }

    nextLevel() {
        if (!this.currentWorld || this.currentLevelIndex === undefined) return;
        if (this.currentLevelIndex + 1 >= this.currentWorld.levels.length) return;
        this.dodo.transitionTo((dodo: Dodo) => new Game(dodo, this.currentWorld!.levels[++this.currentLevelIndex!], this));
    }

    loop = (time: number) => {
        this.dodo.loop(time);
        window.requestAnimationFrame(this.loop);
    };

    run() {
        this.dodo.transitionTo(e => new MainScene(e, this));
        this.dodo.render();
        this.loop(0);
    }
}
