import Renderer from '$/rendering/Renderer';
import { GameBoard } from 'src/game/entities/board';
import { LivingEntity, LivingEntityProps } from './LivingEntity';
import { Scene } from '$/scene/Scene';

export abstract class BoardPieceEntity<T extends LivingEntityProps> extends LivingEntity<T> {
    public abstract readonly zIndex: number;

    public abstract readonly boundingBox: [number, number, number, number];

    public abstract tick(delta: number): void;

    public abstract draw(renderer: Renderer): void;

    protected board?: GameBoard;

    protected boardPosition?: [number, number];

    protected scene: Scene;

    constructor(scene: Scene, props: T) {
        super(props);
        this.scene = scene;
    }

    initBoard(board: GameBoard, position: [ number, number ]) {
        this.board = board;
        this.boardPosition = position;
    }

    protected onDeath(_damager: LivingEntity<any>, _damageType: string, _amount: number): void {
        this.scene.removeEntity(this);
    }

    dispose() {
        if (this.board && this.boardPosition) {
            this.board?.disposeEntity(this.boardPosition[0], this.boardPosition[1], this);
        }
    }
}