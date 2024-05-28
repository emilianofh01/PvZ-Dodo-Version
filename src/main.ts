import Dodo from "./engine/Dodo";
import { Scene } from "./engine/scene/Scene";
import {BasicGUIMenu} from "./gui/elements.ts";
import { Button } from "./gui/components/buttons.ts";
import {SpriteSheet} from "./engine/sprites/spritesheet.ts";
import ResourceManagement from "./engine/resource_management/ResourceManager.ts";
import {ASSET_TYPES, AssetKey} from "./engine/resource_management/IResourceLoader.ts";
import {SunEntity} from "./entities/SunEntity.ts";

const dodo = new Dodo(document.getElementsByTagName("canvas")[0]);


class TestScene extends Scene{
    constructor(dodo: Dodo){
        super(dodo);
    }
}

dodo.transitionTo(e => new TestScene(e));
dodo.render();

const sheet: SpriteSheet = new SpriteSheet(
    ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, "./button_sprite_sheet.png")),
    {
        groups: [
            {
                x: 0,
                y: 0,
                grid_size: [3, 3],
                cell_size: [8, 8],
                name: "button",
                padding: [0, 0]
            }
        ]
    }
)

const menu = new BasicGUIMenu();
menu.addComponent(new Button(dodo, {
    onClick() {
        alert("You have clicked")
    },
    render(renderer, _1, _2, button) {
        /// TODO: Refactor this to a different button class (a button that is rendered using a sprite sheet) or maybe the same class but pass the spritesheet as a parameter in the button config
        const pos = button.config.position;
        const size = button.config.size;
        const group = sheet.getGroup("button");
        const cells_wide = ((size[0] - group.cell_size[0]) / group.cell_size[0]);
        const cells_high = ((size[1] - group.cell_size[1]) / group.cell_size[1]);

        for(let i = 1; i < cells_wide; i++) {
            for(let j = 1; j < cells_high; j++) {
                sheet.drawImage(renderer.context, "button", 4, pos[0] + group.cell_size[0] * i, pos[1] + group.cell_size[1] * j)
            }
        }

        for(let i = 1; i < cells_wide; i++) {
            sheet.drawImage(renderer.context, "button", 1, pos[0] + group.cell_size[0] * i, pos[1])
            sheet.drawImage(renderer.context, "button", 7, pos[0] + group.cell_size[0] * i, pos[1] + size[1] - group.cell_size[1])
        }

        for(let i = 1; i < cells_high; i++) {
            sheet.drawImage(renderer.context, "button", 3, pos[0], pos[1] + group.cell_size[1] * i)
            sheet.drawImage(renderer.context, "button", 5, pos[0] + size[0] - group.cell_size[0], pos[1] + group.cell_size[1] * i)
        }

        sheet.drawImage(renderer.context, "button", 0, ...pos)
        sheet.drawImage(renderer.context, "button", 2, pos[0] + size[0] - group.cell_size[0], pos[1])
        sheet.drawImage(renderer.context, "button", 6, pos[0], pos[1] + size[1] - group.cell_size[1])
        sheet.drawImage(renderer.context, "button", 8, pos[0] + size[0] - group.cell_size[0], pos[1] + size[1] - group.cell_size[1])
    }
}))

dodo.currentScene?.addEntity((scene) => new SunEntity({
    position: [100, 100],
    degreesPerSecond: 90,
    size: [200, 200],
}, scene.dodo))

const loop_fn = (a: number) => {
    dodo.loop(a);
    window.requestAnimationFrame(loop_fn);
}
window.requestAnimationFrame(loop_fn);