import Renderer from "../rendering/Renderer.ts";
import {SpriteSheet} from "./spritesheet.ts";
import {map} from "../../utils/Objects.ts";

interface AnimationProps{
    framesPerSecond: number;
}

export abstract class Animation<T extends AnimationProps = AnimationProps> {
    props: T;
    private timeElapsed: number;
    secondsPerFrame: number;
    
    constructor(props: T) {
        this.props = props;
        this.timeElapsed = 0;
        this.secondsPerFrame = 1 / this.props.framesPerSecond;
    }
    
    animate(delta: number) {
        this.timeElapsed += delta;
        while(this.timeElapsed >= this.secondsPerFrame * 1000) {
            this.timeElapsed -= this.secondsPerFrame * 1000;
            this.nextFrame();
        }
    }
    
    abstract nextFrame(): void;
    abstract render(renderer: Renderer, pivot: [number, number], dest_x: number, dest_y: number, dest_w?: number, dest_h?: number): void;
}

export interface SpriteSheetAnimationProps extends AnimationProps {
    totalFrames: number
    spriteSheet: SpriteSheet
    groupName: string
}

export class SpriteSheetAnimation extends Animation<SpriteSheetAnimationProps> {
    currentFrame: number = 0;
    
    constructor(spriteSheet: SpriteSheet, groupName: string, framesPerSecond: number = 20) {
        super({
            framesPerSecond,
            groupName,
            spriteSheet,
            totalFrames: map(spriteSheet.getGroup(groupName), g => g.frames ?? (g.grid_size[0] * g.grid_size[1]))
        });
    }
    
    nextFrame(){
        this.currentFrame++;
        this.currentFrame %= this.props.totalFrames;
    }
    
    render(renderer: Renderer, pivot: [number, number], dest_x: number, dest_y: number, dest_w?: number, dest_h?: number) {
        if(pivot[0] == 0 && pivot[1] == 0){
            this.props.spriteSheet.drawImage(renderer.context, this.props.groupName, this.currentFrame, dest_x, dest_y, dest_w, dest_h);
            return;
        }
        this.props.spriteSheet.drawImagePivoted(renderer.context, this.props.groupName, this.currentFrame, pivot, dest_x, dest_y, dest_w, dest_h);
    }
}