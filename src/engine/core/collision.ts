export function point2Rect (point: [number, number], rect: [number, number, number, number]) {
  return point[0] >= rect[0] && point[1] >= rect[1] && point[0] < rect[0] + rect[2] && point[1] < rect[1] + rect[3]
}

export function rect2Rect (rect1: [number, number, number, number], rect2: [number, number, number, number]) {
  return rect1[0] < rect2[0] + rect2[2] &&
        rect1[0] + rect1[2] > rect2[0] &&
        rect1[1] < rect2[1] + rect2[3] &&
        rect1[1] + rect1[3] > rect2[1]
}

export function point2Circle (point: [number, number], circle_pos: [number, number], radius: number) {
  return ((point[0] - circle_pos[0]) ** 2 + (point[1] - circle_pos[1]) ** 2) < radius ** 2
}

export function circle2Circle (circle1: [number, number], circle1_r: number, circle2: [number, number], circle2_r: number) {
  return point2Circle(circle1, circle2, Math.min(circle1_r, circle2_r))
}
