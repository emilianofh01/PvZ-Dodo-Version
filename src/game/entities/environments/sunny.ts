import Renderer from "$/rendering/Renderer";
import { Scene } from "$/scene/Scene";
import Entity from "src/entities/Entity";
import { randomFloat, randomInt } from "src/utils/random";

export class SunnyEnvironment implements Entity {
    readonly zIndex: number = 100;
    readonly boundingBox: [number, number, number, number] = [
        0, 0,
        384, 240
    ];

    nextSun: number = 0;
    sunProvider: ((startPosition: [number, number], endPosition: [number, number], duration: number, lifetime: number, sunAmount: number, scene: Scene) => Entity);
    scene: Scene;

    constructor(scene: Scene, sunProvider: ((startPosition: [number, number], endPosition: [number, number], duration: number, lifetime: number, sunAmount: number, scene: Scene) => Entity)){
        this.sunProvider = sunProvider;
        this.scene = scene;
        this.generateNextSun();
    }

    tick(delta: number): void {
        this.nextSun -= delta;
        while(this.nextSun < 0){
            const sunX = randomInt(this.boundingBox[0] + 16, this.boundingBox[2] - 16);
            const sunEndY = randomInt(this.boundingBox[1] + 72, this.boundingBox[3] - 16);
            this.scene.addEntity(
                (scene) => this.sunProvider(
                    [sunX, -32],
                    [sunX, sunEndY],
                    5,
                    10,
                    50,
                    scene
                )
            );
            this.generateNextSun();
        }
    }

    generateNextSun () {
        this.nextSun += randomFloat(5000, 8000);
    }

    draw(_: Renderer): void { }

    dispose(): void { }
    
}