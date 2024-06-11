import { SpriteSheetAnimation } from "$/sprites/animatable";
import { notNullOrUndefined } from "src/utils/Objects";
import { Zombie } from "./Zombie";
import SPRITESHEETS_REGISTRY from "src/game/registries/SpriteSheets";

export class ConeZombie extends Zombie{
    walkingAnim: SpriteSheetAnimation = new SpriteSheetAnimation(
        notNullOrUndefined(SPRITESHEETS_REGISTRY.get('dodo:cone_zombie_walking')),
        'default',
        3,
    );
}