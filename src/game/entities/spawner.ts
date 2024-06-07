import Renderer from '$/rendering/Renderer';
import { Scene } from '$/scene/Scene';
import Entity from 'src/entities/Entity';
import { GameBoard } from './board';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import { Level, Wave } from '../registries/Levels';

export class Spawner implements Entity {
    readonly zIndex: number = 100;

    readonly boundingBox: [number, number, number, number] = [
        0, 0,
        384, 240,
    ];

    scene: Scene;

    board: GameBoard;

    start_x: number = 0;

    wavesQueue?: PriorityQueue<Wave>;

    level?: Level;

    time: number = 0;

    constructor(scene: Scene, board: GameBoard, start_x: number) {
        this.scene = scene;
        this.board = board;
        this.start_x = start_x;
    }

    loadLevel(level: Level) {
        this.level = level;
        this.wavesQueue = new PriorityQueue((a, b) => a.time - b.time, level.waves);
    }

    tick(delta: number): void {
        if (!this.wavesQueue || !this.level || this.wavesQueue.size() == 0) return;
        let x = this.start_x;
        while (this.wavesQueue.front() && this.wavesQueue.front().time <= this.time) {
            const wave = this.wavesQueue.dequeue();
            for (const e of wave.zombiesToGenerate) {
                const lane = e.selectLane(this.scene);
                const pos: [number, number] = [x, this.board.position[1] + this.board.cell_size[1] * (lane + 1)];
                x += this.level!.spacing;
                this.scene.addEntity(scene => e.generate(pos, scene, this.board, lane));
            }
        }
        this.time += delta;
    }

    draw(_: Renderer): void { }

    dispose(): void { }
}
