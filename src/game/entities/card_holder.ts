import Renderer, { Alignment, Baseline, PIVOTS } from '$/rendering/Renderer';
import Entity from 'src/entities/Entity';
import { PlantEntry } from '../registries/Plants';
import { GameBoard } from './board.ts';
import { MOUSE_MOVE, MouseMoveEventData } from '$/input/mouse_movement.ts';
import { point2Rect } from '$/core/collision.ts';
import { MOUSE, MouseButton, MouseEventData, MouseEventType } from '$/input/mouse.ts';
import { Game } from '../scenes/Game.ts';
import { PromiseWaiter } from 'src/utils/Objects.ts';
import { loadImage } from '$/resource_management/ResourceManager.ts';

interface CardData {
    cooldown: number;
}

export class CardHolder implements Entity {
    readonly zIndex: number = 0;

    readonly boundingBox: [number, number, number, number] = [64, 8, 312, 64];

    readonly cardSize: [number, number] = [48, 64];

    readonly cards;

    readonly cardPadding = 8;

    readonly board: GameBoard;

    readonly scene: Game;

    selectedCardIndex: number = -1;

    readonly card_image = new PromiseWaiter(loadImage('./assets/img/gui/seed_card.png'));

    readonly cardsData : CardData[];

    constructor(scene: Game, board: GameBoard, cards: PlantEntry[]) {
        this.board = board;
        this.scene = scene;
        this.scene.dodo.listener_manager.addEventListener(MOUSE_MOVE, this.mouseMove);
        this.scene.dodo.listener_manager.addEventListener(MOUSE, this.mouseDown);
        this.cards = cards;
        this.cardsData = this.cards.map(_ => ({
            cooldown: 0,
        }));
    }

    dispose(): void {
        this.scene.dodo.listener_manager.removeEventListener(MOUSE_MOVE, this.mouseMove);
        this.scene.dodo.listener_manager.removeEventListener(MOUSE, this.mouseDown);
    }

    mouseDown = (event: MouseEventData) => {
        if (event.button != MouseButton.Primary) return;
        if (event.type == MouseEventType.MouseUp) {
            if (this.selectedCardIndex < 0 || !point2Rect(event.position, this.board.boundingBox)) return;
            if (this.board.takeAction(event, this.cards[this.selectedCardIndex])) {
                (this.scene as Game).currentSun -= this.cards[this.selectedCardIndex].cost;
                this.cardsData[this.selectedCardIndex].cooldown = this.cards[this.selectedCardIndex].cooldown;
            }
            this.selectedCardIndex = -1;
        }
        if (!point2Rect(event.position, this.boundingBox)) return;
        const relativePos = [
            event.position[0] - this.boundingBox[0],
            event.position[1] - this.boundingBox[1],
        ];
        const widthWithPadding = [
            this.cardSize[0] + this.cardPadding,
            this.cardSize[1] + this.cardPadding,
        ];
        if ((relativePos[0] % widthWithPadding[0]) >= this.cardSize[0] || (relativePos[1] % widthWithPadding[1]) >= this.cardSize[1]) return;
        const card = Math.floor(relativePos[0] / widthWithPadding[0]);
        if (card < 0 || card - 1 > this.cards.length) return;
        if (this.cards[card].cost > (this.scene as Game).currentSun || this.cardsData[card].cooldown > 0) return;
        this.selectedCardIndex = card;
    };

    mouseMove = (event: MouseMoveEventData) => {
        if (this.selectedCardIndex < 0) return;
        if (!point2Rect(event.position, this.board.boundingBox)) return;
        const mousePos = event.position.map((e, i) => e - this.board.boundingBox[i]) as [number, number];
        this.board.mousePosUpdate(mousePos, this.cards[this.selectedCardIndex]);
    };

    tick(delta: number): void {
        this.cards.forEach(e => e.idleAnimation.animate(delta));
        this.cardsData.forEach(e => e.cooldown > 0 && (e.cooldown -= delta));
    }

    draw(renderer: Renderer): void {
        const cardImage = this.card_image.get();

        this.cards.forEach((e, i) => {
            const cardPos: [number, number] = [this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1]];
            //renderer.context.renderRect(i == this.selectedCardIndex ? '#0f0' : '#f00', this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1], ...this.cardSize);
            //renderer.context.renderRect(i == this.selectedCardIndex ? '#0d0' : '#d00', this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1], this.cardSize[0], this.cardSize[0]);
            if (cardImage) {
                renderer.context.drawImage(cardImage, ...cardPos);
            }
            e.idleAnimation.render(renderer, PIVOTS.TOP_LEFT, this.boundingBox[0] + 8 + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1] + 11);

            renderer.context.setFont('pixel', 16);
            renderer.context.fillStyle = '#000';
            renderer.context.renderText(Math.floor(this.boundingBox[0] + (this.cardSize[0] + 1) / 2 + (this.cardSize[0] + this.cardPadding) * i), Math.floor(this.boundingBox[1] + this.cardSize[1]) - 4, e.cost.toFixed(), Baseline.Alphabetic, Alignment.Center);
            if (this.cards[i].cost > this.scene.currentSun)
                renderer.context.renderRect('#0008', ...cardPos, ...this.cardSize);
            renderer.context.renderRect('#0004', ...cardPos, this.cardSize[0], this.cardSize[1] * this.cardsData[i].cooldown / this.cards[i].cooldown);
        });
    }
}
