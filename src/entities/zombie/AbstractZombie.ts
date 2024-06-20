import Renderer from '$/rendering/Renderer';
import { GameBoard } from 'src/game/entities/board';
import { LivingEntity, LivingEntityProps } from '../LivingEntity';
import { Game } from 'src/game/scenes/Game';

interface Box {
    offset_x: number
    offset_y: number
    width: number
    height: number
}

export interface ZombieProps extends LivingEntityProps {
    speed: number
    damage: number
    biteCooldown: number
    size: [number, number]
    collisionBox: Box
    detectionPoint: [number, number]
}

export abstract class AbstractZombie<T extends ZombieProps = ZombieProps> extends LivingEntity<T> {
    readonly zIndex: number = 10;

    abstract readonly collisionBox: [number, number, number, number];
    
    abstract readonly boundingBox: [number, number, number, number];

    protected readonly board: GameBoard;

    protected targetedEntity: LivingEntity<any> | null = null;

    protected biteTimeElapsed = 0;

    protected position: [ number, number ];

    protected floatPos: [ number, number ];
    
    protected lane: number;

    protected scene: Game;

    constructor(scene: Game, board: GameBoard, props: T, startPos: [ number, number ], lane: number) {
        super(props);
        this.scene = scene;
        this.board = board;
        this.position = [ ...startPos ];
        this.floatPos = [ ...startPos ];
        this.lane = lane;
        board.addEntityToLane(lane, this);
    }

    tick(delta: number) {
        if (!this.scene.gameRunning) {
            return;
        }
        if (this.targetedEntity?.dead) {
            this.targetedEntity = null;
        }
        if (this.hasEnteredTheHouse()) {
            this.scene.gameLost();
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

    hasEnteredTheHouse(): boolean {
        return false;
    }
    
    checkTarget(): boolean {
        return false;
    }

    move(delta: number) {
        this.floatPos[0] -= this.props.speed * delta / 1000;
        this.position[0] = Math.ceil(this.floatPos[0]);
    }

    protected onDeath(_damager: LivingEntity<any>, _damageType: string, _amount: number) {
        console.log(this.scene.spawner.doneSpawning);
        if (this.scene.spawner.doneSpawning) {
            let hasMore = false;
            for (const entities of this.board.laneEntities.values()) {
                if (entities.find(e => e instanceof AbstractZombie && e != this)) {
                    hasMore = true; 
                    break;
                }
            }
            if (!hasMore) {
                this.scene.hasWon(this);
            }
        }
    }

    dispose(): void {
        this.board.removeEntityFromLane(this.lane, this);
    }

    abstract draw(renderer: Renderer): void;

}