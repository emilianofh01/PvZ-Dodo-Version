import Renderer from '../rendering/Renderer.ts';
import { SpriteSheet } from './spritesheet.ts';
import { map } from '../../utils/Objects.ts';

interface AnimationProps {
  framesPerSecond: number
}

export abstract class DodoAnimation<T extends AnimationProps = AnimationProps> {
  props: T;

  private timeElapsed: number;

  secondsPerFrame: number;

  constructor(props: T) {
    this.props = props;
    this.timeElapsed = 0;
    this.secondsPerFrame = 1 / this.props.framesPerSecond;
  }

  animate(delta: number): void {
    this.timeElapsed += delta;
    while (this.timeElapsed >= this.secondsPerFrame * 1000) {
      this.timeElapsed -= this.secondsPerFrame * 1000;
      this.nextFrame();
    }
  }

  abstract ended(): boolean;
  abstract progress(): number;
  abstract restart(): void;
  abstract nextFrame(): void;
  abstract render(renderer: Renderer, pivot: [number, number], destX: number, destY: number, destW?: number, destH?: number): void;
}

export interface SpriteSheetAnimationProps extends AnimationProps {
  totalFrames: number
  spriteSheet: SpriteSheet
  groupName: string
  infinite: boolean
}

export class SpriteSheetAnimation extends DodoAnimation<SpriteSheetAnimationProps> {
  currentFrame: number = 0;

  constructor(spriteSheet: SpriteSheet, groupName: string, framesPerSecond: number = 20, infinite: boolean = true) {
    super({
      framesPerSecond,
      groupName,
      spriteSheet,
      infinite,
      totalFrames: map(spriteSheet.getGroup(groupName), g => g.frames ?? (g.grid_size[0] * g.grid_size[1])),
    });
  }

  nextFrame(): void {
    if (!this.props.infinite && this.ended()) return;
    this.currentFrame++;

    if (this.currentFrame > this.props.totalFrames) {
      this.currentFrame %= this.props.totalFrames;
      if (!this.props.infinite) {
        this.currentFrame = this.props.totalFrames - 1;
      }
    }
  }

  render(renderer: Renderer, pivot: [number, number], destX: number, destY: number, destW?: number, destH?: number): void {
    if (pivot[0] === 0 && pivot[1] === 0) {
      this.props.spriteSheet.drawImage(renderer.context, this.props.groupName, this.currentFrame, destX, destY, destW, destH);
      return;
    }
    this.props.spriteSheet.drawImagePivoted(renderer.context, this.props.groupName, this.currentFrame, pivot, destX, destY, destW, destH);
  }

  restart(): void {
    this.currentFrame = 0;
  }

  ended(): boolean {
    return this.currentFrame === this.props.totalFrames;
  }

  progress(): number {
    return this.currentFrame / this.props.totalFrames;
  }
}
