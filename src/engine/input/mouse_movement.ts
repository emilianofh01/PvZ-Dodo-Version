import { BroadcasterKey, InputBroadcaster } from './broadcasting.ts'

type pos = [number, number]

export class MouseMoveEventData {
  public readonly position: pos
  public readonly screenPosition: pos
  public readonly documentPosition: pos
  public readonly delta: pos

  constructor (position: pos, screenPosition: pos, documentPosition: pos, delta: pos) {
    this.position = position
    this.screenPosition = screenPosition
    this.documentPosition = documentPosition
    this.delta = delta
  }

  static of (element: HTMLCanvasElement, event: MouseEvent) {
    return new MouseMoveEventData(
      [(event.pageX - element.offsetLeft) * element.width / element.offsetWidth, (event.pageY - element.offsetTop) * element.height / element.offsetHeight],
      [event.screenX, event.screenY],
      [event.pageX, event.pageY],
      [event.movementX, event.movementY]
    )
  }
}

export const MOUSE_MOVE: BroadcasterKey<MouseMoveEventData> = BroadcasterKey.make(MouseMoveEventData)

export class MouseMovementBroadcaster implements InputBroadcaster<MouseMoveEventData> {
  public readonly key: BroadcasterKey<MouseMoveEventData> = MOUSE_MOVE
  public callbacks: Set<(event: MouseMoveEventData) => void | boolean> = new Set()

  public element: HTMLCanvasElement | null = null

  mousemove = (event: MouseEvent) => {
    (this.element != null) && this.dispatchEvent(MouseMoveEventData.of(this.element, event))
  }

  attach (element: HTMLCanvasElement): void {
    this.element = element
    document.addEventListener('mousemove', this.mousemove)
  }

  detach (element: HTMLCanvasElement): void {
    this.element == element && (this.element = null)
    document.removeEventListener('mousemove', this.mousemove)
  }

  addEventListener (callback: (event: MouseMoveEventData) => void | boolean): void {
    this.callbacks.add(callback)
  }

  dispatchEvent (event: MouseMoveEventData): boolean {
    let d = false
    this.callbacks.forEach(e => e(event) && (d = true))
    return d
  }

  removeEventListener (callback: (event: MouseMoveEventData) => void | boolean): void {
    this.callbacks.delete(callback)
  }
}
