import { MinPriorityQueue, PriorityQueue } from '@datastructures-js/priority-queue';

export function fixQueue<T>(queue: PriorityQueue<T>) {
    (((queue as any)._heap as any)._nodes as T[]).sort((queue as any)._heap._compare);
}

export function queueIterable <T>(queue: PriorityQueue<T>) {
    return ((queue as any)._heap as any)._nodes as T[];
}

export function minQueueIterable <T>(queue: MinPriorityQueue<T>) {
    return ((queue as any)._heap._heap as any)._nodes as T[];
}