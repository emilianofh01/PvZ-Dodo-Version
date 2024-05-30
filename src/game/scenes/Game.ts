import {Scene} from "$/scene/Scene.ts";
import Dodo from "$/Dodo.ts";
import {SunCounter} from "../overlays/SunCounter.ts";
import {GameBoard} from "../entities/board.ts";
import { SunEntity } from "src/entities/SunEntity.ts";
import { CardHolder } from "../entities/card_holder.ts";

export class Game extends Scene {
    currentSun= 15;
    
    constructor(dodo: Dodo) {
        super(dodo);
        this.addEntity(_ => new SunCounter(this.getSun));
        this.addEntity(s => new GameBoard(s))
        this.addEntity(s => new SunEntity({
            degreesPerSecond: 90,
            position: [90, 90],
            size: [32, 32],
            sunAmount: 90
        }, s.dodo))
        this.addEntity(e => new CardHolder())
    }
    
    
    getSun = () => this.currentSun;
}