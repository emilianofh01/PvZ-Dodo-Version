import Renderer, { BackdropFill } from '../rendering/Renderer';
import Dodo from '../Dodo';
import IScene from './IScene';
import ResourceManagement from '../resource_management/ResourceManager';
import { ASSET_TYPES, AssetKey } from '../resource_management/IResourceLoader';
import Entity from '../../entities/Entity';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import { queueIterable } from '$/core/priorityQueue';

export class Scene implements IScene {
    dodo: Dodo;

    entities: PriorityQueue<Entity>;

    public readonly fill: BackdropFill = '#070';

    constructor(dodo: Dodo) {
        this.dodo = dodo;
        this.entities = new PriorityQueue<Entity>((a, b) => a.zIndex > b.zIndex ? 1 : a.zIndex < b.zIndex ? -1 : 0);
    }

    dispose(): void {
        this.entities.toArray().forEach(e => e.dispose());
    }

    async preload(): Promise<void> {
        await ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, './assets/img/1.jpg'));
    }

    addEntity<T extends Entity>(provider: (scene: Scene) => T) {
        const entity = provider(this);
        this.entities.push(entity);
        return entity;
    }

    removeEntity(entity: Entity) {
        entity.dispose();
        this.entities.remove(e => e == entity);
    }

    update(delta: number): void {
        for (const entity of queueIterable(this.entities)) {
            entity.tick(delta);
        }
    }

    render(renderer: Renderer): void {
        for (const entity of queueIterable(this.entities)) {
            entity.draw(renderer);
        }
    }
}
