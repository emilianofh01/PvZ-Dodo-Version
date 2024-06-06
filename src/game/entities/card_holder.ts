import Renderer, { PIVOTS } from '$/rendering/Renderer';
import Entity from 'src/entities/Entity';
import PLANTS_REGISTRY from '../registries/Plants';
import { GameBoard } from './board.ts';
import { Scene } from '$/scene/Scene.ts';
import { MOUSE_MOVE, MouseMoveEventData } from '$/input/mouse_movement.ts';
import { point2Rect } from '$/core/collision.ts';
import { MOUSE, MouseButton, MouseEventData, MouseEventType } from '$/input/mouse.ts';
import { Game } from '../scenes/Game.ts';

export class CardHolder implements Entity {
    readonly zIndex: number = 0;

    readonly boundingBox: [number, number, number, number] = [64, 8, 312, 64];

    readonly cardSize: [number, number] = [48, 64];

    readonly cards = [
        ...PLANTS_REGISTRY.getAll(),
    ];

    readonly cardPadding = 8;

    readonly board: GameBoard;

    readonly scene: Scene;

    selectedCardIndex: number = -1;

    constructor(scene: Scene, board: GameBoard) {
        this.board = board;
        this.scene = scene;
        this.scene.dodo.listener_manager.addEventListener(MOUSE_MOVE, this.mouseMove);
        this.scene.dodo.listener_manager.addEventListener(MOUSE, this.mouseDown);
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
        if (this.cards[card].cost > (this.scene as Game).currentSun) return;
        this.selectedCardIndex = card;
    };

    mouseMove = (event: MouseMoveEventData) => {
        if (this.selectedCardIndex < 0) return;
        if (!point2Rect(event.position, this.board.boundingBox)) return;
        const mousePos = event.position.map((e, i) => e - this.board.boundingBox[i]) as [number, number];
        this.board.mousePosUpdate(mousePos);
    };

    tick(delta: number): void {
        this.cards.forEach(e => e.idleAnimation.animate(delta));
    }

    draw(renderer: Renderer): void {
        renderer.context.renderRect('#fff', ...this.boundingBox);
        this.cards.forEach((e, i) => {
            renderer.context.renderRect(i == this.selectedCardIndex ? '#0f0' : '#f00', this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1], ...this.cardSize);
            renderer.context.renderRect(i == this.selectedCardIndex ? '#0d0' : '#d00', this.boundingBox[0] + (this.cardSize[0] + this.cardPadding) * i, this.boundingBox[1], this.cardSize[0], this.cardSize[0]);
            e.idleAnimation.render(renderer, PIVOTS.MID_CENTER, this.boundingBox[0] + this.cardSize[0] / 2, this.boundingBox[1] + this.cardSize[0] / 2);

            renderer.context.textAlign = 'center';
            renderer.context.textBaseline = 'bottom';
            renderer.context.fillStyle = '#000';
            renderer.context.font = '16px pixel';
            renderer.context.textRendering = 'geometricPrecision';
            renderer.context.fillText(e.cost.toFixed(), this.boundingBox[0] + (this.cardSize[0] + 1) / 2, this.boundingBox[1] + this.cardSize[1]);
        });
    }
}
