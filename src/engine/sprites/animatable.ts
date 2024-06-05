import Renderer from '../rendering/Renderer.ts';
import { SpriteSheet } from './spritesheet.ts';
import { map } from '../../utils/Objects.ts';

interface AnimationProps {
  framesPerSecond: number
}

export class DodoAnimationEvent extends Event {
}

interface DodoAnimationEventMap {
  'start': DodoAnimationEvent;
  'end': DodoAnimationEvent;
  'step': DodoAnimationEvent;
}

export abstract class AbstractAnimation<T extends AnimationProps = AnimationProps> extends EventTarget {
  props: T;

  private _timeElapsed: number;

  public get timeElapsed() : number {
    return this._timeElapsed;
  }

  protected started: boolean = false;

  secondsPerFrame: number;

  constructor(props: T) {
    super();
    this.props = props;
    this._timeElapsed = 0;
    this.secondsPerFrame = 1 / this.props.framesPerSecond;
  }

  animate(delta: number): void {
    this.handleStarted();
    this._timeElapsed += delta;
    while (this._timeElapsed >= this.secondsPerFrame * 1000) {
      this._timeElapsed -= this.secondsPerFrame * 1000;
      this.nextFrame();
    }
  }

  protected handleStarted() {
    if (this.started == false) {
      this.started = true;
      this.onStarted();
    }
  }

  protected onStarted() {
    this.dispatchEvent(new DodoAnimationEvent('start'));
  }

  protected onEnded() {
    this.dispatchEvent(new DodoAnimationEvent('ended'));
  }

  protected onStep() {
    this.dispatchEvent(new DodoAnimationEvent('step'));
  }


  addEventListener<K extends keyof DodoAnimationEventMap>(type: K, listener: (this: Animation, ev: DodoAnimationEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
    super.addEventListener(type, listener, options);
  }
  
  removeEventListener<K extends keyof DodoAnimationEventMap>(type: K, listener: (this: Animation, ev: DodoAnimationEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
    super.removeEventListener(type, listener, options);
  }

  abstract ended(): boolean;
  abstract progress(): number;
  abstract duration(): number;
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

export class SpriteSheetAnimation extends AbstractAnimation<SpriteSheetAnimationProps> {
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
    if (this.ended()) return;
    this.currentFrame++;

    if (this.currentFrame >= this.props.totalFrames) {
      this.currentFrame %= this.props.totalFrames;
      if (!this.props.infinite) {
        this.currentFrame = this.props.totalFrames - 1;
        this.onEnded();
      } else {
        this.onStep();
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
    return this.currentFrame === this.props.totalFrames && !this.props.infinite;
  }

  progress(): number {
    return this.currentFrame / this.props.totalFrames;
  }

  duration(): number {
    return this.props.totalFrames * 1000 / this.props.framesPerSecond;
  }
}
