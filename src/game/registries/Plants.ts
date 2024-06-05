import { Registry } from '$/core/registry';
import { ASSET_TYPES, AssetKey } from '$/resource_management/IResourceLoader';
import ResourceManagement from '$/resource_management/ResourceManager';
import { Scene } from '$/scene/Scene';
import { SpriteSheetAnimation } from '$/sprites/animatable';
import { SpriteSheet } from '$/sprites/spritesheet';
import Entity from 'src/entities/Entity';
import { SunEntity } from 'src/entities/SunEntity';
import { Sunflower } from 'src/entities/plant/Sunflower';
import { GameBoard } from '../entities/board.ts';
import { AbstractPlantEntity } from '../../entities/plant/PlantEntity.ts';

export interface PlantFactoryProps {
  position: [number, number]
}

export interface PlantEntry {
  name: string
  description: string
  idleAnimation: SpriteSheetAnimation
  cost: number
  canPlant?: (pos: [number, number], board: GameBoard) => boolean
  factory: (props: PlantFactoryProps, scene: Scene) => Entity
}

const REQUIRE_EMPTY = (pos: [number, number], board: GameBoard) => (board.gridMap.get(pos[0])?.get(pos[1])?.find(e => e instanceof AbstractPlantEntity)) == null;

const PLANTS_REGISTRY = new Registry<PlantEntry>();

PLANTS_REGISTRY.add('dodo:sunflower', {
  name: 'Sunflower',
  description: "Sunflower can't resist bouncing to the beat. Which beat is that? Why, the life-giving jazzy rhythm of the Earth itself, thumping at a frequency only Sunflower can hear.",
  cost: 50,
  canPlant: REQUIRE_EMPTY,
  idleAnimation: new SpriteSheetAnimation(
    new SpriteSheet(
      ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, './assets/img/sunflower_glow.png')),
      {
        groups: [
          {
            cell_size: [31, 31],
            grid_size: [3, 3],
            name: 'default',
            padding: [1, 1],
            x: 0,
            y: 1,
            frames: 7,
          },
        ],
      },
    ),
    'default',
    6,
  ),
  factory(props: PlantFactoryProps, scene: Scene) {
    return new Sunflower(
      {
        position: props.position,
      },
      (position, sunAmount, constructorScene) => new SunEntity({ degreesPerSecond: 90, position, size: [32, 32], sunAmount }, constructorScene.dodo),
      scene.dodo,
    );
  },
});

export default PLANTS_REGISTRY;
