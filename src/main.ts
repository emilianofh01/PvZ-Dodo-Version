import { PlantsVsZombies } from './game/game.ts'

const game = new PlantsVsZombies(document.getElementsByTagName('canvas')[0])
game.run()