/**
 * Minimum ikili yığın — A* açık kümesi için.
 *
 * Çanakkale'de 47 il vardı ve açık kümeyi her adımda doğrusal taramak
 * sorun değildi. Dünya haritasında 4.575 il ve 12.553 kenar var; aynı
 * tarama yol başına milyonlarca karşılaştırma demek. Yığınla aynı iş
 * O(log n) oluyor.
 */
export class MinHeap<T> {
  private keys: number[] = [];
  private items: (T | undefined)[] = [];

  get size(): number {
    return this.items.length;
  }

  push(item: T, key: number): void {
    this.items.push(item);
    this.keys.push(key);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.keys[parent]! <= this.keys[i]!) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  pop(): T | undefined {
    const n = this.items.length;
    if (n === 0) return undefined;
    const top = this.items[0]!;
    const lastItem = this.items.pop()!;
    const lastKey = this.keys.pop()!;
    if (n > 1) {
      this.items[0] = lastItem;
      this.keys[0] = lastKey;
      let i = 0;
      const len = this.items.length;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let small = i;
        if (l < len && this.keys[l]! < this.keys[small]!) small = l;
        if (r < len && this.keys[r]! < this.keys[small]!) small = r;
        if (small === i) break;
        this.swap(i, small);
        i = small;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const ti = this.items[a]!;
    this.items[a] = this.items[b]!;
    this.items[b] = ti;
    const tk = this.keys[a]!;
    this.keys[a] = this.keys[b]!;
    this.keys[b] = tk;
  }
}
