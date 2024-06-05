import { IGUIOverlay } from '$/gui/controller'
import Renderer from '../rendering/Renderer'

export default class FPSOverlay implements IGUIOverlay {
  readonly zIndex: number = 0
  fps: number[] = []

  render (renderer: Renderer): void {
    renderer.context.fillStyle = '#000'
    renderer.context.font = '16px sans-serif'
    renderer.context.textRendering = 'optimizeLegibility'
    renderer.context.fontKerning = 'none'
    renderer.context.fillText('FPS:' + [...this.fps].sort()[Math.floor(this.fps.length / 2)], 0, 16)
  }

  tick (delta: number): void {
    if (this.fps.length > 5) { this.fps.shift() }
    this.fps.push(Math.round(1000 / Math.ceil(delta)))
  }

  dispose (): void {

  }
}
