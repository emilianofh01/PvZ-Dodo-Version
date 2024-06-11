import Renderer, { Alignment, Baseline, PIVOTS } from '$/rendering/Renderer.ts';
import { ASSET_TYPES, AssetKey } from '$/resource_management/IResourceLoader';
import ResourceManagement, { loadImage } from '$/resource_management/ResourceManager';
import Entity from 'src/entities/Entity';
import { PromiseWaiter, notNull } from 'src/utils/Objects';

export class SunCounter implements Entity {
    rotation: number = 0;

    sunSprite: CanvasImageSource | null = null;

    scale: number = 1;

    readonly boundingBox: [number, number, number, number] = [
        8, 8, 48, 64,
    ];

    readonly zIndex = 0;

    readonly sunGetter: () => number;

    readonly image = new PromiseWaiter(loadImage('./assets/img/gui/sun_counter.png'));

    constructor(sunGetter: () => number) {
        this.sunGetter = sunGetter;
        ResourceManagement.instance.load(new AssetKey(ASSET_TYPES.IMAGE, './assets/img/sun.png')).then(e => {
            this.sunSprite = e;
        });
    }

    draw(renderer: Renderer): void {
        if (this.image.get()) {
            renderer.context.drawImage(notNull(this.image.get()), 8, 8);
        }
        renderer.context.fillStyle = '#000';
        renderer.context.setFont('pixel', 16);
        renderer.context.renderText(32, 69, this.sunGetter().toFixed(), Baseline.Alphabetic, Alignment.Center);

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
