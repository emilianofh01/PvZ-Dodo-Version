import Dodo from '$/Dodo';
import { Button } from '$/gui/components/buttons';
import { BasicGUIMenu } from '$/gui/elements';
import { loadImage } from '$/resource_management/ResourceManager';
import { Scene } from '$/scene/Scene';
import { TintedSpriteSheet } from '$/sprites/spritesheet';
import { Game } from './Game';

class MainMenu extends BasicGUIMenu {
    constructor(dodo: Dodo) {
        super();
        this.addComponent(new Button(
            dodo, 
            {
                position: [105, 106],
                size: [174, 20],
                buttonFace: new TintedSpriteSheet(
                    loadImage('./button_sprite_sheet.png'),
                    {
                        groups: [
                            {
                                x: 0,
                                y: 0,
                                grid_size: [3, 3],
                                cell_size: [8, 8],
                                name: 'button',
                                padding: [0, 0],
                            },
                        ],
                        tint: [1, 1, 1],
                    },
                ),
                onClick: () => {
                    dodo.transitionTo(() => new Game(dodo));
                },
                text: 'Play',
            },
        ));
    }
}

export default class MainScene extends Scene {
    constructor(dodo: Dodo) {
        super(dodo);
        dodo.guiController.setMenu(new MainMenu(dodo));
    }
}