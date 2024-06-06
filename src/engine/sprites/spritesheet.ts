import { notNullOrUndefined } from '../../utils/Objects.ts';

type Size = [number, number];

interface SpriteSheetGroup {
    name: string
    x: number
    y: number
    grid_size: Size
    cell_size: Size
    padding: Size
    frames?: number
}

interface SpriteSheetData {
    groups: SpriteSheetGroup[]
}

export class SpriteSheet<T extends SpriteSheetData = SpriteSheetData> {
    protected _image: CanvasImageSource | null;

    readonly config: T;

    readonly groups: Map<string, SpriteSheetGroup>;

    public get image() {
        return this._image;
    }

    constructor(image: CanvasImageSource | Promise<CanvasImageSource>, config: T) {
        if (image instanceof Promise) {
            image.then(e => this._image = e);
            this._image = null;
        } else {
            this._image = image;
        }
        this.config = config;
        this.groups = new Map<string, SpriteSheetGroup>();
        config.groups.forEach(e => {
            this.groups.set(e.name, e);
        });
    }

    getGroup(group_name: string) {
        return notNullOrUndefined(this.groups.get(group_name));
    }

    drawImage(context: CanvasRenderingContext2D, group_name: string, index: number, dest_x: number, dest_y: number, dest_w?: number, dest_h?: number) {
        if (this.image == null) return;
        if (!this.groups.has(group_name)) return;
        const group = notNullOrUndefined(this.groups.get(group_name));
        const col = Math.floor(index / group.grid_size[0]);
        const row = index % group.grid_size[0];
        const x = row * (group.cell_size[0] + group.padding[0]);
        const y = col * (group.cell_size[1] + group.padding[1]);
        context.drawImage(this.image, x, y, ...group.cell_size, dest_x, dest_y, dest_w ?? group.cell_size[0], dest_h ?? group.cell_size[1]);
    }

    drawImagePivoted(context: CanvasRenderingContext2D, group_name: string, index: number, pivot: [number, number], dest_x: number, dest_y: number, dest_w?: number, dest_h?: number) {
        if (this.image == null) return;
        if (!this.groups.has(group_name)) return;
        const group = notNullOrUndefined(this.groups.get(group_name));
        const col = Math.floor(index / group.grid_size[0]);
        const row = index % group.grid_size[0];
        const x = row * (group.cell_size[0] + group.padding[0]);
        const y = col * (group.cell_size[1] + group.padding[1]);
        dest_w ??= group.cell_size[0];
        dest_h ??= group.cell_size[1];
        context.drawImage(this.image, x, y, ...group.cell_size, dest_x - (pivot[0] * dest_w), dest_y - (pivot[1] * dest_h), dest_w, dest_h);
    }

    static defaultGroup: SpriteSheetGroup = {
        cell_size: [32, 32],
        grid_size: [1, 1],
        name: 'default',
        padding: [0, 0],
        x: 0,
        y: 0,
        frames: 1,
    };
    
    static singleGroup(image: CanvasImageSource | Promise<CanvasImageSource>, group: Partial<SpriteSheetGroup>) {
        return new SpriteSheet(image, {
            groups: [
                { ...this.defaultGroup, ...group },
            ],
        });
    }
}

type Color = [number, number, number] | [number, number, number, number];

interface TintedSpriteSheetConfig extends SpriteSheetData {
    tint: Color
}

export class TintedSpriteSheet extends SpriteSheet<TintedSpriteSheetConfig> {
    
    private _tinted_image: CanvasImageSource | null = null;

    override get image() {
        return this._tinted_image ?? this.tryGenerateImage();
    }
    
    tryGenerateImage() {
        if (this._image) {
            if (this._image instanceof HTMLImageElement) {
                const w = this._image.width;
                const h = this._image.height;
                const canvas = document.createElement('canvas') as HTMLCanvasElement;
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (!ctx) return null;
                ctx.drawImage(this._image, 0, 0);
                const image = ctx.getImageData(0, 0, w, h);
                const { data } = image;
                for (let i = 0; i < data.length; i += 4) {
                    data[i + 0] *= this.config.tint[0];
                    data[i + 1] *= this.config.tint[1];
                    data[i + 2] *= this.config.tint[2];
                    data[i + 3] *= this.config.tint[3] ?? 1;
                }
                ctx.putImageData(image, 0, 0);
                this._tinted_image = canvas;
            }
        }
        return this._tinted_image;
    }
}