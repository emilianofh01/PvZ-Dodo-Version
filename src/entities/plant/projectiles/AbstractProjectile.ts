import { rect2Rect } from '$/core/collision';
import Renderer from '$/rendering/Renderer';
import { Scene } from '$/scene/Scene';
import { LivingEntity, LivingEntityProps } from 'src/entities/LivingEntity';
import { AbstractZombie } from 'src/entities/zombie/AbstractZombie';
import { GameBoard } from 'src/game/entities/board';

export interface ProjectileProps extends LivingEntityProps {
    size: [number, number]
    speed: [number, number]
    damage: number
}

export abstract class AbstractProjectile<T extends ProjectileProps = ProjectileProps> extends LivingEntity<T> {
    readonly zIndex: number = 4;
    
    protected position: [ number, number ];

    protected floatPos: [ number, number ];

    readonly gameBoard: GameBoard;

    readonly lane: number;

    readonly scene: Scene;

    constructor(scene: Scene, board: GameBoard, lane: number,  position: [ number, number ], props: T) {
        super(props);
        this.position = position;
        this.floatPos = position;
        this.gameBoard = board;
        this.lane = lane;
        this.scene = scene;
    }

    get boundingBox(): [number, number, number, number] {
        return [ 
            Math.floor(this.position[0] - this.props.size[0] / 2),
            Math.floor(this.position[1] - this.props.size[1] / 2),
            ...this.props.size,
        ];
    }
    
    tick(delta: number) {
        this.floatPos[0] += this.props.speed[0] * delta / 1000;
        this.floatPos[1] += this.props.speed[1] * delta / 1000;
        this.position = [
            Math.floor(this.floatPos[0]),
            Math.floor(this.floatPos[1]),
        ];
        let entity: AbstractZombie<any> | null = null;
        this.gameBoard.getEntitiesOfLane(this.lane).forEach(e => {
            if (e instanceof AbstractZombie && rect2Rect(this.boundingBox, e.collisionBox)) {
                entity = e;
            }
        });
        if (entity) {
            LivingEntity.damage(this, entity, 'dodo:projectile', this.props.damage);
            this.scene.removeEntity(this);
        }
    }
    
    abstract draw(renderer: Renderer): void;
    
    dispose() {
        this.gameBoard.removeEntityFromLane(this.lane, this);
    }

}