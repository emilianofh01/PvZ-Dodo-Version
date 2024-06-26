export function randomFloat(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
}
