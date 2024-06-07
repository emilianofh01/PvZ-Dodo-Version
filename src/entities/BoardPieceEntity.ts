import Renderer from '$/rendering/Renderer';
import { GameBoard } from 'src/game/entities/board';
import { LivingEntity, LivingEntityProps } from './LivingEntity';

export abstract class BoardPieceEntity<T extends LivingEntityProps> extends LivingEntity<T> {
    public abstract readonly zIndex: number;

    public abstract readonly boundingBox: [number, number, number, number];

    public abstract tick(delta: number): void;

    public abstract draw(renderer: Renderer): void;

    private board?: GameBoard;

    private boardPosition?: [number, number];

    initBoard(board: GameBoard, position: [ number, number ]) {
        this.board = board;
        this.boardPosition = position;
    }

    dispose() {
        if (this.board && this.boardPosition) {
            this.board?.disposeEntity(this.boardPosition[0], this.boardPosition[1], this);
        }
    }
}