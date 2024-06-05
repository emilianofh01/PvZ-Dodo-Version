import { ListenerManager } from './input/listener'
import Renderer from './rendering/Renderer'
import IScene from './scene/IScene'
import { BasicGuiController, IGUIController } from './gui/controller.ts'

export default class Dodo {
  public readonly canvas: HTMLCanvasElement
  public readonly renderer: Renderer
  public readonly guiController: IGUIController
  public readonly listener_manager: ListenerManager
  private _currentScene: IScene | null = null
  private last_update: DOMHighResTimeStamp | null = null

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.renderer = new Renderer(canvas)
    this.listener_manager = new ListenerManager(this)
    this.guiController = new BasicGuiController(this)
  }

  get currentScene () {
    return this._currentScene
  }

  transitionTo (provider: (dodo: Dodo) => IScene) {
    this._currentScene?.dispose()
    this._currentScene = provider(this)
  }

  update (delta: number) {
    this._currentScene?.update(delta)
    this.guiController.tick(delta)
  }

  render () {
    (this._currentScene != null) && this.renderer.renderScene(this._currentScene)
    this.renderer.renderGui(this.guiController)
  }

  loop (timer: DOMHighResTimeStamp) {
    if (this.last_update == null) {
      this.last_update = timer
    }
    const delta = timer - this.last_update
    this.last_update = timer
    this.update(delta)
    this.render()
  }
}
