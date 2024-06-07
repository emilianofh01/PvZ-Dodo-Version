import Renderer, { PIVOTS } from '$/rendering/Renderer';
import { SpriteSheet } from '$/sprites/spritesheet';
import { AbstractProjectile, ProjectileProps } from './AbstractProjectile';

interface BasicProjectileProps extends ProjectileProps {
    sprite: SpriteSheet;
}

export class BasicProjectile extends AbstractProjectile<BasicProjectileProps> {
    draw(renderer: Renderer): void {
        this.props.sprite.drawImagePivoted(renderer.context, 'default', 0, PIVOTS.MID_CENTER, ...this.position, 16, 16);
    }
}