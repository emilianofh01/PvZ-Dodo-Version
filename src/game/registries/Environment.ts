import Entity from 'src/entities/Entity';
import { Game } from '../scenes/Game';
import { Registry } from '$/core/registry';
import { SunnyEnvironment } from '../entities/environments/sunny';
import { Scene } from '$/scene/Scene';
import { SunEntity } from 'src/entities/SunEntity';

export interface EnvironmentEntry {
  isSunny: boolean
  factory: (game: Game) => Entity
}

export const ENVIRONMENTS_REGISTRY = new Registry<EnvironmentEntry>();

ENVIRONMENTS_REGISTRY.add('dodo:sunny', {
  isSunny: true,
  factory: game => new SunnyEnvironment(
    game,
    (startPosition: [number, number], endPosition: [number, number], duration: number, lifetime: number, sunAmount: number, scene: Scene) => new SunEntity(
      {
        degreesPerSecond: 90,
        position: startPosition,
        startPosition,
        endPosition,
        size: [32, 32],
        sunAmount,
        transitionDutarion: duration,
      },
      scene.dodo,
    ),
  ),
});
