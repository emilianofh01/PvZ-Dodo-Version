import {Scene} from "$/scene/Scene.ts";
import Dodo from "$/Dodo.ts";
import {SunCounter} from "../overlays/SunCounter.ts";
import {GameBoard} from "../entities/board.ts";

export class Game extends Scene {
    currentSun= 15;
    
    constructor(dodo: Dodo) {
        super(dodo);
        this.dodo.guiController.addOverlay(new SunCounter(this.getSun));
        this.addEntity(s => new GameBoard(s))
    }
    
    
    getSun = () => this.currentSun;
}