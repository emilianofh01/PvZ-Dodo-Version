import { Registry } from '$/core/registry';
import { loadImage } from '$/resource_management/ResourceManager';
import { SpriteSheet } from '$/sprites/spritesheet';

const SPRITESHEETS_REGISTRY = new Registry<SpriteSheet>();

SPRITESHEETS_REGISTRY.add(
    'dodo:sunflower_idle', 
    SpriteSheet.singleGroup(loadImage('./assets/img/sunflower_idle.png'), { grid_size: [2, 3], frames: 6 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:sunflower_glow',
    SpriteSheet.singleGroup(loadImage('./assets/img/sunflower_glow.png'), { grid_size: [3, 3], frames: 6 }),
);

export default SPRITESHEETS_REGISTRY;