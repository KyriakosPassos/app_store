export class Lru_Cache<K extends string | number, V> {
  private cache: Map<K, V>;
  private readonly size: number;

  constructor(size: number) {
    if (size <= 0) throw new Error("Size must be greater than 0.");
    this.size = size;
    this.cache = new Map<K, V>();
  }

  public get(key: K): V | undefined {
    const cachedItem = this.cache.get(key);
    if (cachedItem) {
      this.cache.delete(key);
      this.cache.set(key, cachedItem);
    }
    return cachedItem;
  }

  public set(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size === this.size) {
      const lruKey: K = this.cache.keys().next().value as K;
      this.cache.delete(lruKey);
    }
    this.cache.set(key, value);
  }

  public clear(): void {
    this.cache.clear();
  }

  public peek(key: K): V | undefined {
    return this.cache.get(key);
  }
}
