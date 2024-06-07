import Renderer from '$/rendering/Renderer';
import { GameBoard } from 'src/game/entities/board';
import { LivingEntity, LivingEntityProps } from '../LivingEntity';

interface Box {
    offset_x: number
    offset_y: number
    width: number
    height: number
}

interface ZombieProps extends LivingEntityProps {
    speed: number
    damage: number
    biteCooldown: number
    size: [number, number]
    collisionBox: Box
    detectionPoint: [number, number]
}

export abstract class AbstractZombie<T extends ZombieProps = ZombieProps> extends LivingEntity<T> {
    readonly zIndex: number = 10;
    
    abstract readonly boundingBox: [number, number, number, number];

    protected readonly board: GameBoard;

    protected targetedEntity: LivingEntity<any> | null = null;

    protected biteTimeElapsed = 0;

    protected position: [ number, number ];

    protected floatPos: [ number, number ];
    
    protected lane: number;

    constructor(board: GameBoard, props: T, startPos: [ number, number ], lane: number) {
        super(props);
        this.board = board;
        this.position = [ ...startPos ];
        this.floatPos = [ ...startPos ];
        this.lane = lane;
    }

    tick(delta: number) {
        if (this.targetedEntity?.dead) {
            this.targetedEntity = null;
        }
        if (this.targetedEntity == null) {
            if (!this.checkTarget()) {
                this.move(delta);
            }
            return;
        }
        this.biteTimeElapsed += delta;
        if (this.biteTimeElapsed > this.props.biteCooldown) {
            let bites = Math.floor(this.biteTimeElapsed / this.props.biteCooldown);
            while (bites-- > 0) {
                LivingEntity.damage(this, this.targetedEntity, 'dodo:zombie', this.props.damage);
            }
            this.biteTimeElapsed %= this.props.biteCooldown;
        }
    }
    
    checkTarget(): boolean {
        /// TODO: check the next cell to see if there are plants there
        return false;
    }

    move(delta: number) {
        this.floatPos[0] -= this.props.speed * delta / 1000;
        this.position[0] = Math.ceil(this.floatPos[0]);
    }

    abstract draw(renderer: Renderer): void;
    
    abstract dispose(): void;

}