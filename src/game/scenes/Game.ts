import { Scene } from '$/scene/Scene.ts';
import Dodo from '$/Dodo.ts';
import { SunCounter } from '../overlays/SunCounter.ts';
import { GameBoard } from '../entities/board.ts';
import { CardHolder } from '../entities/card_holder.ts';
import { ENVIRONMENTS_REGISTRY, EnvironmentEntry } from '../registries/Environment.ts';
import { notNullOrUndefined } from 'src/utils/Objects.ts';
import { Spawner } from '../entities/spawner.ts';
import { LEVELS_REGISTRY } from '../registries/Levels.ts';
import { BasicGUIMenu } from '$/gui/elements.ts';
import { Button } from '$/gui/components/buttons.ts';
import { TintedSpriteSheet } from '$/sprites/spritesheet.ts';
import { loadImage } from '$/resource_management/ResourceManager.ts';
import Renderer, { Alignment, Baseline } from '$/rendering/Renderer.ts';
import MainScene from './MainScene.ts';


export class Game extends Scene {
    currentSun = 50;

    environment: EnvironmentEntry = notNullOrUndefined(ENVIRONMENTS_REGISTRY.get('dodo:sunny'));

    gameBoard: GameBoard;

    gameRunning: boolean;

    static lostMenu: (scene: Scene) => BasicGUIMenu;

    constructor(dodo: Dodo) {
        super(dodo);
        this.addEntity(_ => new SunCounter(this.getSun));
        const level = notNullOrUndefined(LEVELS_REGISTRY.get('dodo:level_1-1'));
        const board = this.gameBoard = this.addEntity(s => new GameBoard(s, level.lanes));
        this.addEntity(scene => this.environment.factory(scene as Game));
        this.addEntity(scene => new CardHolder(scene, board));
        this.gameRunning = true;
    }

    gameLost() {
        if (!this.gameRunning) return;
        this.gameRunning = false;
        this.dodo.guiController.setMenu(Game.lostMenu(this));
    }

    getSun = () => this.currentSun;
}

export class LostGameMenu extends BasicGUIMenu {
    constructor(scene: Scene) {
        super();
        this.addComponent({
            zIndex: 0,
            render: function (renderer: Renderer): void {
                renderer.context.clear('#f008');
                renderer.context.fillStyle = '#FFF';
                renderer.context.setFont('pixel', 40);
                renderer.context.renderText(renderer.context.canvas.width / 2, 50, "You've lost", Baseline.Middle, Alignment.Center);
            },
            dispose: function (): void {
                
            },
        });
        this.addComponent(new Button(
            scene.dodo, 
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
                    scene.dodo.transitionTo(() => new Game(scene.dodo));
                },
                text: 'Restart',
            },
        ));
        this.addComponent(new Button(
            scene.dodo, 
            {
                position: [105, 136],
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
                    scene.dodo.transitionTo(() => new MainScene(scene.dodo));
                },
                text: 'Back to main menu',
            },
        ));
    }
}

Game.lostMenu = (scene: Scene) => new LostGameMenu(scene);