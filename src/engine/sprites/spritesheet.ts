import {notNullOrUndefined} from "../../utils/Objects.ts";

type size = [number, number];

interface SpriteSheetGroup {
    name: string
    x: number
    y: number
    grid_size: size
    cell_size: size
    padding: size
}

interface SpriteSheetData {
    groups: SpriteSheetGroup[];
}

export class SpriteSheet {
    private _image: CanvasImageSource | null;
    readonly  config: SpriteSheetData;
    readonly groups: Map<string, SpriteSheetGroup>;
    
    public get image() {
        return this._image;
    }
    
    constructor(image: CanvasImageSource | Promise<CanvasImageSource>, config: SpriteSheetData) {
        if(image instanceof Promise){
            image.then(e => this._image = e);
            this._image = null
        }else{
            this._image = image
        }
        this.config = config;
        this.groups = new Map<string, SpriteSheetGroup>();
        config.groups.forEach(e => {
            this.groups.set(e.name, e);
        })
    }
    
    getGroup(group_name: string){
        return notNullOrUndefined(this.groups.get(group_name));
    }

    drawImage(context: CanvasRenderingContext2D, group_name: string, index: number, dest_x: number, dest_y: number, dest_w?: number, dest_h?: number){
        if(this.image == null) return;
        if(!this.groups.has(group_name)) return;
        const group = notNullOrUndefined(this.groups.get(group_name))
        const col = Math.floor(index / group.grid_size[0]);
        const row = index % group.grid_size[1];
        const x = row * (group.cell_size[0] + group.padding[0]);
        const y = col * (group.cell_size[1] + group.padding[1]);
        context.drawImage(this.image, x, y, ...group.cell_size, dest_x, dest_y, dest_w ?? group.cell_size[0], dest_h ?? group.cell_size[1]);
    }
}
