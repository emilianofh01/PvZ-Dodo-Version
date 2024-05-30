import Dodo from "../../engine/Dodo";
import Renderer, { PIVOTS } from "../../engine/rendering/Renderer";
import { ASSET_TYPES, AssetKey } from "../../engine/resource_management/IResourceLoader";
import ResourceManagement from "../../engine/resource_management/ResourceManager";
import { Scene } from "../../engine/scene/Scene";
import { SpriteSheetAnimation } from "../../engine/sprites/animatable";
import { SpriteSheet } from "../../engine/sprites/spritesheet";
import Entity from "../Entity";
import { SunHarvestingPlant } from "./SunHarvestingPlant";

interface SunflowerProps {
    position: [number, number]
}


export class Sunflower extends SunHarvestingPlant {
    readonly boundingBox: [number, number, number, number];
    sunflowerAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        new SpriteSheet(
            ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, "./assets/img/sunflower_glow.png")), 
            {
                groups: [
                    {
                        cell_size: [31, 31],
                        grid_size: [3, 3],
                        name: "default",
                        padding: [1, 1],
                        x: 0,
                        y: 0,
                        frames: 7
                    }
                ]
            }
        ),
        "default",
        6
    )

    zIndex: number = 0;

    constructor(sunflowerProps: SunflowerProps, sunProvider: ((position: [number, number], sunAmount: number, scene: Scene) => Entity), dodo: Dodo){
        super(sunProvider, {
            cooldown: 24000,
            sunAmount: 25,
            sunSpawningPoint: [.65, .65]
        }, dodo);
        this.boundingBox = [...sunflowerProps.position, 31, 31];
    }

    tick(delta: number): void {
        super.tick(delta);
        this.sunflowerAnim.animate(delta);
    }

    draw(renderer: Renderer): void {
        this.sunflowerAnim.render(renderer, PIVOTS.TOP_LEFT, ...this.boundingBox);
    }
    
    dispose(): void {
    }

}