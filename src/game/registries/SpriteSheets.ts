import { Registry } from '$/core/registry';
import { loadImage } from '$/resource_management/ResourceManager';
import { SpriteSheet } from '$/sprites/spritesheet';

const SPRITESHEETS_REGISTRY = new Registry<SpriteSheet>();

SPRITESHEETS_REGISTRY.add(
    'dodo:sunflower_idle', 
    SpriteSheet.singleGroup(loadImage('./assets/img/entities/plants/sunflower_idle.png'), { grid_size: [2, 3], frames: 6 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:sunflower_glow',
    SpriteSheet.singleGroup(loadImage('./assets/img/entities/plants/sunflower_glow.png'), { grid_size: [3, 3], frames: 6 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:peashooter_idle',
    SpriteSheet.singleGroup(loadImage('./assets/img/entities/plants/peashooter_idle.png'), { grid_size: [3, 4], frames: 10 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:peashooter_shooting',
    SpriteSheet.singleGroup(loadImage('./assets/img/entities/plants/peashooter_shooting.png'), { grid_size: [3, 3], frames: 9 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:zombie_walking',
    SpriteSheet.singleGroup(loadImage('./assets/img/entities/zombies/zombie_walking.png'), { grid_size: [3, 3], frames: 8 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:pea',
    SpriteSheet.singleGroup(loadImage('./assets/img/entities/projectiles/pea.png'), { grid_size: [1, 1], frames: 1 }),
);

SPRITESHEETS_REGISTRY.add(
    'dodo:grass',
    SpriteSheet.singleGroup(loadImage('./assets/img/grass.png'), { grid_size: [2, 2], frames: 3 }),
);
export default SPRITESHEETS_REGISTRY;