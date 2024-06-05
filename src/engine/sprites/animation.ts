import Renderer from '$/rendering/Renderer';
import { AbstractAnimation, DodoAnimationEvent } from './animatable';

export class AnimationController {
  protected currentAnimation: AbstractAnimation | null = null;

  protected animationQueue: AbstractAnimation[] = [];

  get nextAnimation() {
    return this.animationQueue[0] ?? null;
  }

  constructor(animation?: AbstractAnimation) {
    this.setAnimation(animation ?? null);
  }

  update(delta: number): void {
    if (this.currentAnimation == null) {
      this.goToNextAnimation();
      return;
    }
    this.currentAnimation?.animate(delta);
  }

  onAnimationStep = (_event: DodoAnimationEvent) => {
    if (this.nextAnimation) 
      this.goToNextAnimation(true);
  };

  onAnimationEnd = (_event: DodoAnimationEvent) => {
    if (this.nextAnimation)
      this.goToNextAnimation(true);
  };

  private goToNextAnimation(withOldDelta?: boolean, forced?: boolean) {
    const oldDelta = this.currentAnimation ? Math.max(this.currentAnimation.timeElapsed % this.currentAnimation.duration(), 0) : null;
    const ended = this.currentAnimation?.ended();
    const animation = this.setAnimation(this.animationQueue.shift() ?? null);
    if (withOldDelta && oldDelta && (ended || forced)) {
      animation?.animate(oldDelta);
    }
  }

  private setAnimation<T extends AbstractAnimation | null>(animation: T): T {
    if (this.currentAnimation) {
      this.currentAnimation.removeEventListener('step', this.onAnimationStep);
      this.currentAnimation.removeEventListener('end', this.onAnimationEnd);
    }
    this.currentAnimation = animation;
    this.currentAnimation?.addEventListener('step', this.onAnimationStep);
    this.currentAnimation?.addEventListener('end', this.onAnimationEnd);
    this.currentAnimation?.restart();
    return animation;
  }

  addToQueue(animation: AbstractAnimation) {
    this.animationQueue.push(animation);
  }

  clearQueue() {
    this.animationQueue = [];
  }

  render(renderer: Renderer, pivot: [number, number], destX: number, destY: number, destW?: number, destH?: number) : void {
    this.currentAnimation?.render(renderer, pivot, destX, destY, destW, destH);
  }

  skip(usedelta?: boolean) {
    this.goToNextAnimation(usedelta, true);
  }
}
