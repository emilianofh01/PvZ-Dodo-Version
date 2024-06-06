import IScene from '../scene/IScene';
import { notNull } from '../../utils/Objects';
import { IGUIController } from '$/gui/controller';

declare global {
    interface CanvasRenderingContext2D extends CanvasRenderingContext2DEx {}
}

export type BackdropFill = string | CanvasGradient | CanvasPattern;
export type Rect = [number, number, number, number];

const BASELINES: CanvasTextBaseline[] = [
    'alphabetic',
    'bottom',
    'hanging',
    'ideographic',
    'middle',
    'top',
];

const ALIGNMENTS: CanvasTextAlign[] = [
    'center',
    'end',
    'left',
    'right',
    'start',
];

export enum Baseline {
    Alphabetic = 0,
    Bottom = 1,
    Hanging = 2,
    Ideographic = 3, 
    Middle = 4,
    Top = 5,
}

export enum Alignment {
    Center = 0,
    End = 1,
    Left = 2,
    Right = 3, 
    Start = 4,
}

interface FontStyle {
    type: 'normal' | 'italic' | 'oblique'
    rot?: number
}

interface DefaultFontStyles {
    NORMAL: FontStyle
    ITALIC: FontStyle
    OBLIQUE: FontStyle
}

const FONT_STYLES : DefaultFontStyles = {
    NORMAL: { type: 'normal' },
    ITALIC: { type: 'italic' },
    OBLIQUE: { type: 'oblique' },
};

interface FontWeight {
    weight: 'normal' | 'bold' | 'bolder' | 'lighter' | 'absolute',
    absolute?: number
}

interface DefaultFontWeights {
    NORMAL: FontWeight
    BOLD: FontWeight
    BOLDER: FontWeight
    LIGHTER: FontWeight
}

const FONT_WEIGHTS : DefaultFontWeights = {
    NORMAL: { weight: 'normal' },
    BOLD: { weight: 'bold' },
    BOLDER: { weight: 'bolder' },
    LIGHTER: { weight: 'lighter' },
};

export interface CanvasRenderingContext2DEx {
    clear: (color?: BackdropFill) => void
    renderRect: (fill: BackdropFill, ...rect: Rect) => void
    drawImageRotated: (image: CanvasImageSource, rotation: number, pivot: [number, number], sx: number, sy: number, sw: number, sh: number, dx?: number, dy?: number, dw?: number, dh?: number) => void
    renderText: (x: number, y: number, text: string, baseline?: Baseline, alignment?: Alignment) => void;
    setFont: (fontName: string, size: number, style?: FontStyle, weight?: FontWeight, lineHeight?: number) => void;
}

export const PIVOTS = Object.freeze({
    TOP_CENTER: [0.5, 0] as [number, number],
    MID_CENTER: [0.5, 0.5] as [number, number],
    BOT_CENTER: [0.5, 1] as [number, number],
    TOP_LEFT: [0, 0] as [number, number],
    MID_LEFT: [0, 0.5] as [number, number],
    BOT_LEFT: [0, 1] as [number, number],
    TOP_RIGHT: [1, 0] as [number, number],
    MID_RIGHT: [1, 0.5] as [number, number],
    BOT_RIGHT: [1, 1] as [number, number],
});

CanvasRenderingContext2D.prototype.drawImageRotated = function (image: CanvasImageSource, rotation: number, pivot: [number, number], sx: number, sy: number, sw: number, sh: number, dx?: number, dy?: number, dw?: number, dh?: number) {
    const x = dx != undefined ? dx : sx;
    const y = dy != undefined ? dy : sy;
    this.save();
    this.translate(x, y);
    this.rotate(rotation);
    if (dx !== undefined && dy !== undefined && dw !== undefined && dh !== undefined) { this.drawImage(image, sx, sy, sw, sh, -dw * pivot[0], -dh * pivot[1], dw, dh); } else { this.drawImage(image, -sw * pivot[0], -sh * pivot[1], sw, sh); }
    this.restore();
};

CanvasRenderingContext2D.prototype.renderText = function (x: number, y: number, text: string, baseline: Baseline = Baseline.Middle, alignment: Alignment = Alignment.Center) {
    this.textAlign = ALIGNMENTS[alignment];
    this.textBaseline = BASELINES[baseline];
    this.fillText(text, x, y);
};

CanvasRenderingContext2D.prototype.setFont = function (fontName: string, size: number, style: FontStyle = FONT_STYLES.NORMAL, weight: FontWeight = FONT_WEIGHTS.NORMAL, lineHeight?: number) {
    this.font = `${style.type} ${style.type == 'oblique' ? style.rot ?? '' : ''} ${weight.absolute ?? weight.weight} ${size}px ${lineHeight ?? ''} ${fontName}`;
};

CanvasRenderingContext2D.prototype.clear = function (color) {
    if (color) 
        this.fillStyle = color;
    this.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderingContext2D.prototype.renderRect = function (fill, ...rect) {
    this.fillStyle = fill;
    this.fillRect(...rect);
};

export default class Renderer {
    private readonly canvas: HTMLCanvasElement;

    public readonly context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = notNull(this.canvas.getContext('2d'), "Couldn't not make context");
    }

    renderScene(level: IScene) {
        this.context.clear(level.fill);
        level.render(this);
    }

    renderGui(controller: IGUIController) {
        controller.render(this);
    }
}
