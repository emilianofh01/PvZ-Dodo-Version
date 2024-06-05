import { BroadcasterKey, InputBroadcaster } from './broadcasting.ts';

type Pos = [number, number];

export class MouseMoveEventData {
  public readonly position: Pos;

  public readonly screenPosition: Pos;

  public readonly documentPosition: Pos;

  public readonly delta: Pos;

  constructor(position: Pos, screenPosition: Pos, documentPosition: Pos, delta: Pos) {
    this.position = position;
    this.screenPosition = screenPosition;
    this.documentPosition = documentPosition;
    this.delta = delta;
  }

  static of(element: HTMLCanvasElement, event: MouseEvent) {
    return new MouseMoveEventData(
      [(event.pageX - element.offsetLeft) * element.width / element.offsetWidth, (event.pageY - element.offsetTop) * element.height / element.offsetHeight],
      [event.screenX, event.screenY],
      [event.pageX, event.pageY],
      [event.movementX, event.movementY],
    );
  }
}

export const MOUSE_MOVE: BroadcasterKey<MouseMoveEventData> = BroadcasterKey.make(MouseMoveEventData);

export class MouseMovementBroadcaster implements InputBroadcaster<MouseMoveEventData> {
  public readonly key: BroadcasterKey<MouseMoveEventData> = MOUSE_MOVE;

  public callbacks: Set<(event: MouseMoveEventData) => void | boolean> = new Set();

  public element: HTMLCanvasElement | null = null;

  mousemove = (event: MouseEvent) => {
    if (this.element != null) this.dispatchEvent(MouseMoveEventData.of(this.element, event));
  };

  attach(element: HTMLCanvasElement): void {
    this.element = element;
    document.addEventListener('mousemove', this.mousemove);
  }

  detach(element: HTMLCanvasElement): void {
    if (this.element == element) this.element = null;
    document.removeEventListener('mousemove', this.mousemove);
  }

  addEventListener(callback: (event: MouseMoveEventData) => void | boolean): void {
    this.callbacks.add(callback);
  }

  dispatchEvent(event: MouseMoveEventData): boolean {
    let d = false;
    this.callbacks.forEach(e => e(event) && (d = true));
    return d;
  }

  removeEventListener(callback: (event: MouseMoveEventData) => void | boolean): void {
    this.callbacks.delete(callback);
  }
}
