import {Scene} from "$/scene/Scene.ts";
import Dodo from "$/Dodo.ts";
import {SunCounter} from "../overlays/SunCounter.ts";
import {GameBoard} from "../entities/board.ts";
import { SunEntity } from "src/entities/SunEntity.ts";
import { CardHolder } from "../entities/card_holder.ts";
import { ENVIRONMENTS_REGISTRY, EnvironmentEntry } from "../registries/Environment.ts";
import { notNullOrUndefined } from "src/utils/Objects.ts";

export class Game extends Scene {
    currentSun = 15;
    environment: EnvironmentEntry = notNullOrUndefined(ENVIRONMENTS_REGISTRY.get('dodo:sunny'));
    
    constructor(dodo: Dodo) {
        super(dodo);
        this.addEntity(_ => new SunCounter(this.getSun));
        const board = this.addEntity(s => new GameBoard(s))
        this.addEntity(s => new SunEntity({
            degreesPerSecond: 90,
            position: [90, 90],
            size: [32, 32],
            sunAmount: 90,
            startPosition: [90, 90],
            endPosition: [200, 200],
            transitionDutarion: 10000
        }, s.dodo))
        this.addEntity(scene => this.environment.factory(scene as Game))
        this.addEntity(scene => new CardHolder(scene, board))
    }
    
    
    getSun = () => this.currentSun;
}