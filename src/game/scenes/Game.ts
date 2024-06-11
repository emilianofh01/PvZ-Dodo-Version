import { Scene } from '$/scene/Scene.ts';
import Dodo from '$/Dodo.ts';
import { SunCounter } from '../overlays/SunCounter.ts';
import { GameBoard } from '../entities/board.ts';
import { CardHolder } from '../entities/card_holder.ts';
import { ENVIRONMENTS_REGISTRY, EnvironmentEntry } from '../registries/Environment.ts';
import { notNullOrUndefined } from 'src/utils/Objects.ts';
import { Spawner } from '../entities/spawner.ts';
import { LEVELS_REGISTRY, Level } from '../registries/Levels.ts';
import { BasicGUIMenu } from '$/gui/elements.ts';
import { Button } from '$/gui/components/buttons.ts';
import { TintedSpriteSheet } from '$/sprites/spritesheet.ts';
import { loadImage } from '$/resource_management/ResourceManager.ts';
import Renderer, { Alignment, Baseline } from '$/rendering/Renderer.ts';
import MainScene from './MainScene.ts';
import PLANTS_REGISTRY from '../registries/Plants.ts';
import { Reward } from '../entities/reward.ts';
import { AbstractZombie } from 'src/entities/zombie/AbstractZombie.ts';
import { PlantsVsZombies } from '../game.ts';


export class Game extends Scene {
    currentSun = 50;

    environment: EnvironmentEntry = notNullOrUndefined(ENVIRONMENTS_REGISTRY.get('dodo:sunny'));

    readonly gameBoard: GameBoard;

    gameRunning: boolean;

    readonly spawner: Spawner;

    static lostMenu: (scene: Game) => BasicGUIMenu;

    readonly level: Level;

    readonly pvz: PlantsVsZombies;

    constructor(dodo: Dodo, level: Level, game: PlantsVsZombies) {
        super(dodo);
        this.pvz = game;
        this.addEntity(_ => new SunCounter(this.getSun));
        this.level = level;
        const board = this.gameBoard = this.addEntity(s => new GameBoard(s, level.lanes));
        this.addEntity(scene => this.environment.factory(scene as Game));
        this.addEntity(scene => new CardHolder(scene as Game, board, level.fixedSeeds ?? [ ...PLANTS_REGISTRY.getAll() ]));
        const spawner = this.spawner = this.addEntity(scene => new Spawner(scene, board, 384));
        spawner.loadLevel(level);
        this.currentSun = level.startingSuns;
        this.gameRunning = true;
    }

    gameLost() {
        if (!this.gameRunning) return;
        this.gameRunning = false;
        this.dodo.guiController.setMenu(Game.lostMenu(this));
    }

    hasWon(lastZombieAlive: AbstractZombie) {
        if (this.level.reward) {
            this.addEntity(scene => new Reward(scene, [
                lastZombieAlive.boundingBox[0] + lastZombieAlive.boundingBox[2] / 2,
                lastZombieAlive.boundingBox[1] + lastZombieAlive.boundingBox[3],
            ], this.level.reward!));
        }
    }

    getSun = () => this.currentSun;
}

export class LostGameMenu extends BasicGUIMenu {
    constructor(scene: Game) {
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
                    scene.pvz.restartLevel();
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
                    scene.dodo.transitionTo(() => new MainScene(scene.dodo, scene.pvz));
                },
                text: 'Back to main menu',
            },
        ));
    }
}

Game.lostMenu = (scene: Game) => new LostGameMenu(scene);