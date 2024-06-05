import Renderer, { PIVOTS } from '$/rendering/Renderer.ts';
import { ASSET_TYPES, AssetKey } from '$/resource_management/IResourceLoader';
import ResourceManagement from '$/resource_management/ResourceManager';
import Entity from 'src/entities/Entity';

export class SunCounter implements Entity {
    rotation: number = 0;

    sunSprite: CanvasImageSource | null = null;

    scale: number = 1;

    readonly boundingBox: [number, number, number, number] = [
        8, 8, 48, 64,
    ];

    readonly zIndex = 0;

    readonly sunGetter: () => number;

    constructor(sunGetter: () => number) {
        this.sunGetter = sunGetter;
        ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, './assets/img/sun.png')).then(e => {
            this.sunSprite = e;
        });
    }

    draw(renderer: Renderer): void {
    // renderer.context.renderRect("#fff", ...[0, 0, renderer.context.canvas.width, 64+16]);
        renderer.context.renderRect('#666', ...[8, 8, 48, 64]);

        renderer.context.textAlign = 'center';
        renderer.context.textBaseline = 'bottom';
        renderer.context.fillStyle = '#000';
        renderer.context.font = '16px pixel';
        renderer.context.textRendering = 'geometricPrecision';
        renderer.context.fillText(this.sunGetter().toFixed(), 32, 70);

        if (this.sunSprite == null) return;
        renderer.context.drawImageRotated(this.sunSprite, this.rotation / 1000 * Math.PI / 180, PIVOTS.MID_CENTER, 24 + 8, 24 + 8, 32 * this.scale, 32 * this.scale);
    }

    tick(delta: number) {
        this.rotation += 90 * delta;
        if (this.rotation > 360000) {
            this.rotation = this.rotation % 360000;
        }
        this.scale = 1 + (Math.cos((this.rotation / 1000 * Math.PI / 180) * 7) * 0.2) / 2;
    }

    dispose() {
    }
}
