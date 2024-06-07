import Renderer from '$/rendering/Renderer';
import Entity from './Entity';

export interface LivingEntityProps {
    health: number;
}

export abstract class LivingEntity<T extends LivingEntityProps> implements Entity {
    abstract readonly zIndex: number;
    
    abstract readonly boundingBox: [number, number, number, number];

    protected props: T;

    protected currentHealth: number;

    constructor(props: T) {
        this.props = props;
        this.currentHealth = props.health;
    }

    get health() {
        return this.currentHealth;
    }

    get dead() {
        return this.currentHealth <= 0;
    }

    get alive() {
        return this.currentHealth > 0;
    }


    protected onTakeDamage(_damager: LivingEntity<any>, _damageType: string, _amount: number) { }

    protected onDeath(_damager: LivingEntity<any>, _damageType: string, _amount: number) { }

    protected onDamage(_damagee: LivingEntity<any>, _damageType: string, _amount: number) { }

    makeDamage(damagee: LivingEntity<any>, damageType: string, amount: number) {
        amount = damagee.damageCalculation(this, damageType, amount);
        this.onDamage(damagee, damageType, amount);
    }

    takeDamage(damager: LivingEntity<any>, damageType: string, amount: number) {
        if (this.currentHealth <= 0) {
            return;
        }
        amount = this.damageCalculation(damager, damageType, amount);
        if (amount > 0) {
            this.currentHealth -= amount;
            this.onTakeDamage(damager, damageType, amount);
            if (this.currentHealth <= 0) {
                this.onDeath(damager, damageType, amount);
            }
        }
    }

    damageCalculation(_from: LivingEntity<any>, _damageType: string, amount: number) {
        return amount;
    }

    static damage(damager: LivingEntity<any>, damagee: LivingEntity<any>, damageType: string, amount: number) {
        damager.makeDamage(damagee, damageType, amount);
        damagee.takeDamage(damager, damageType, amount);
    }

    abstract tick(delta: number): void;
    
    abstract draw(renderer: Renderer): void;
    
    abstract dispose(): void;

}