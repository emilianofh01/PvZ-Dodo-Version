

const left = (i: number) => (i << 1) + 1;
const right = (i: number) => (i + 1) << 1;

export class PriorityQueue<T> {
    private static readonly top = 0;
    private static readonly  parent = (i: number) => ((i + 1) >>> 1) - 1;
    
    private readonly  heap: T[];
    
    private readonly comparator: (a: T, b: T) => boolean;
    
    constructor(comparator = (a: T, b: T) => a > b) {
        this.heap = [];
        this.comparator = comparator;
    }
    size() {
        return this.heap.length;
    }
    
    isEmpty() {
        return this.size() == 0;
    }
    
    peek() {
        return this.heap[PriorityQueue.top];
    }
    
    push(...values: T[]) {
        values.forEach(value => {
            this.heap.push(value);
            this.siftUp();
        });
        return this.size();
    }
    
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > PriorityQueue.top) {
            this.swap(PriorityQueue.top, bottom);
        }
        this.heap.pop();
        this.siftDown();
        return poppedValue;
    }
    
    forEach(fn: (element: T) => void){
        this.heap.forEach(fn);
    }
    
    remove(value: T){
        const index = this.heap.indexOf(value);
        if(index > PriorityQueue.top){
            this.swap(index, PriorityQueue.top);
        }
        this.heap.pop();
        this.siftUp(index);
    }
    
    replace(value: T) {
        const replacedValue = this.peek();
        this.heap[PriorityQueue.top] = value;
        this.siftDown();
        return replacedValue;
    }
    
    private greater(i: number, j: number) {
        return this.comparator(this.heap[i], this.heap[j]);
    }
    
    private swap(i: number, j: number) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    private siftUp(startIndex: number = this.size() - 1) {
        let node = startIndex;
        while (node > PriorityQueue.top && this.greater(node, PriorityQueue.parent(node))) {
            this.swap(node, PriorityQueue.parent(node));
            node = PriorityQueue.parent(node);
        }
    }
    
    private siftDown(startIndex: number = PriorityQueue.top) {
        let currentNode = startIndex;
        while (
            (left(currentNode) < this.size() && this.greater(left(currentNode), currentNode)) ||
            (right(currentNode) < this.size() && this.greater(right(currentNode), currentNode))
        ) {
            let maxChild = (right(currentNode) < this.size() && this.greater(right(currentNode), left(currentNode))) ? right(currentNode) : left(currentNode);
            this.swap(currentNode, maxChild);
            currentNode = maxChild;
        }
    }
}