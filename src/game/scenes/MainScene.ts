import Dodo from '$/Dodo';
import { Button } from '$/gui/components/buttons';
import { BasicGUIMenu } from '$/gui/elements';
import { loadImage } from '$/resource_management/ResourceManager';
import { Scene } from '$/scene/Scene';
import { TintedSpriteSheet } from '$/sprites/spritesheet';
import { notNullOrUndefined } from 'src/utils/Objects';
import { PlantsVsZombies } from '../game';
import WORLDS_REGISTRY from '../registries/Worlds';

class MainMenu extends BasicGUIMenu {
    constructor(dodo: Dodo, game: PlantsVsZombies) {
        super();
        this.addComponent(new Button(
            dodo, 
            {
                position: [105, 106],
                size: [174, 20],
                onClick: () => {
                    game.loadLevel(notNullOrUndefined(WORLDS_REGISTRY.get('dodo:day')), 0);
                },
                text: 'Play',
            },
        ));
        this.addComponent(new Button(
            dodo, 
            {
                position: [105, 136],
                size: [174, 20],
                onClick: () => {
                    window.close();
                },
                text: 'Exit',
            },
        ));
    }
}

export default class MainScene extends Scene {
    constructor(dodo: Dodo, game: PlantsVsZombies) {
        super(dodo);
        dodo.guiController.setMenu(new MainMenu(dodo, game));
    }
}