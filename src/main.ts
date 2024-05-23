import Dodo from "./engine/Dodo";

const dodo = new Dodo(document.getElementsByTagName("canvas")[0]);
dodo.renderer.renderLevel({
  render(renderer) {
    renderer.context.renderRect("#000", 20, 10, 20, 20)
  }
});