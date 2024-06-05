export class Registry<T> {
  readonly registry_map = new Map<string, T>();

  add(key: string, obj: T) {
    this.registry_map.set(key, obj);
  }

  get(key: string) {
    return this.registry_map.get(key);
  }

  getAll(): IterableIterator<T> {
    return this.registry_map.values();
  }
}
