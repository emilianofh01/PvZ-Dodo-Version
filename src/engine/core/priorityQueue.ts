import { PriorityQueue } from '@datastructures-js/priority-queue';

export function queueIterable <T>(queue: PriorityQueue<T>) {
    return ((queue as any)._heap as any)._nodes as T[];
}