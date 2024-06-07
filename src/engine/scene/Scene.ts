import Renderer, { BackdropFill } from '../rendering/Renderer';
import Dodo from '../Dodo';
import IScene from './IScene';
import ResourceManagement from '../resource_management/ResourceManager';
import { ASSET_TYPES, AssetKey } from '../resource_management/IResourceLoader';
import Entity from '../../entities/Entity';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import { fixQueue, queueIterable } from '$/core/priorityQueue';

export class Scene implements IScene {
    dodo: Dodo;

    entitiesToRemove: Set<Entity> = new Set();

    entitiesToAdd: Set<Entity> = new Set();

    entities: PriorityQueue<Entity>;

    public readonly fill: BackdropFill = '#070';

    constructor(dodo: Dodo) {
        this.dodo = dodo;
        this.entities = new PriorityQueue<Entity>((a, b) => a.zIndex - b.zIndex);
    }

    dispose(): void {
        this.entities.toArray().forEach(e => e.dispose());
    }

    async preload(): Promise<void> {
        await ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, './assets/img/1.jpg'));
    }

    addEntity<T extends Entity>(provider: (scene: Scene) => T) {
        const entity = provider(this);
        this.entitiesToAdd.add(entity);
        return entity;
    }

    removeEntity(entity: Entity) {
        entity.dispose();
        this.entitiesToRemove.add(entity);
    }

    update(delta: number): void {
        if (this.entitiesToRemove.size > 0 || this.entitiesToAdd.size > 0) {
            if (this.entitiesToRemove.size > 0) {
                this.entities.remove(e => this.entitiesToRemove.has(e));
                this.entitiesToRemove.clear();
            }
    
            if (this.entitiesToAdd.size > 0) {
                this.entitiesToAdd.forEach(e => this.entities.enqueue(e));
                this.entitiesToAdd.clear();
            }
            fixQueue(this.entities);
        }
        
        for (const entity of queueIterable(this.entities)) {
            if (!this.entitiesToRemove.has(entity))
                entity.tick(delta);
        }
    }

    render(renderer: Renderer): void {
        for (const entity of queueIterable(this.entities)) {
            entity.draw(renderer);
        }
    }
}
