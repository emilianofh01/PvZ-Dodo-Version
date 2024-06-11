import Renderer from '$/rendering/Renderer';
import { Scene } from '$/scene/Scene';
import Entity from 'src/entities/Entity';
import { GameBoard, PlantPlacementData } from './board';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import { Level, StartLevelCondition, Wave } from '../registries/Levels';
import { Game } from '../scenes/Game';

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

    hasStarted: boolean = false;

    time: number = 0;

    conditions?: StartLevelCondition[];

    doneSpawning: boolean = false;

    constructor(scene: Scene, board: GameBoard, start_x: number) {
        this.scene = scene;
        this.board = board;
        this.start_x = start_x;
        this.board.addEventListener('plantplaced', this.plantPlaced);
    }

    plantPlaced = (data: CustomEvent<PlantPlacementData>) => {
        console.log('a');
        if (this.conditions) {
            let changed = false;
            for (const condition of this.conditions) {
                changed = changed || condition.onPlant(data.detail);
            }
            if (changed) this.checkConditions();
        }
    };

    checkConditions() {
        if (this.conditions) {
            let passed = true;
            for (const condition of this.conditions) {
                if (!condition.check(this.scene as Game)) {
                    passed = false;
                    break;
                }
            }
            if (passed) {
                this.hasStarted = true;
            }
        }
    }

    loadLevel(level: Level) {
        this.level = level;
        this.wavesQueue = new PriorityQueue((a, b) => a.time - b.time, level.waves);
        this.conditions = level.startLevelConditions ?? [];
        if (!level.startLevelConditions || level.startLevelConditions.length == 0) {
            this.hasStarted = true;
        }
    }

    tick(delta: number): void {
        if (!this.hasStarted && this.conditions) {
            let changed = false;
            for (const condition of this.conditions) {
                changed = changed || condition.tick(delta);
            }
            if (changed) this.checkConditions();
        }
        if (!this.wavesQueue || !this.level || this.wavesQueue.size() == 0 || !this.hasStarted) return;
        let x = this.start_x;
        while (this.wavesQueue.front() && this.wavesQueue.front().time <= this.time) {
            const wave = this.wavesQueue.dequeue();
            for (const e of wave.batch) {
                const lane = e.selectLane(this.scene);
                const position: [number, number] = [x, this.board.position[1] + this.board.cell_size[1] * (lane + 1)];
                x += this.level!.spacing;
                this.scene.addEntity(scene => e.zombie.factory({
                    gameBoard: this.board,
                    lane,
                    position,
                }, scene));
            }
        }
        if (this.wavesQueue.size() == 0) {
            this.doneSpawning = true;
        }
        this.time += delta;
    }

    draw(_: Renderer): void { }

    dispose(): void { }
}
