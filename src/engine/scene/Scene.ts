import Renderer, { BackdropFill } from "../rendering/Renderer";
import Dodo from "../Dodo";
import IScene from "./IScene";
import ResourceManagement from "../resource_management/ResourceManager";
import { ASSET_TYPES, AssetKey } from "../resource_management/IResourceLoader";
import Entity from "../../entities/Entity";

export class Scene implements IScene {
    dodo: Dodo;
    entities: Entity[];

    public readonly fill: BackdropFill = "#070";
    
    constructor(dodo: Dodo){
        this.dodo = dodo;
        this.entities = [];
    }

    dispose(): void {
        this.entities.forEach(e => e.dispose());
    }

    async preload(): Promise<void> {
        await ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, "./assets/img/1.jpg"));
    }

    addEntity(provider: (scene: Scene) => Entity) {
        const entity = provider(this)
        this.entities.push(entity);
    }

    removeEntity(entity: Entity){
        entity.dispose();
        this.entities = this.entities.filter(e => e != entity);
    }

    update(delta: number): void {
        this.entities.forEach(e => e.tick(delta))
    }

    render(renderer: Renderer): void {
        this.entities.forEach(e => e.draw(renderer));
    }

}