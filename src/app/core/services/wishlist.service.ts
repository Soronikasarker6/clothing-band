import { Injectable, computed, effect, inject, signal } from '@angular/core';

import type { Product } from '../models/catalog.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'maison.wishlist.v1';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storage = inject(StorageService);
  private readonly ids = signal<readonly number[]>(
    this.storage.read<readonly number[]>(STORAGE_KEY, []),
  );

  readonly productIds = this.ids.asReadonly();
  readonly count = computed(() => this.ids().length);

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.ids()));
  }

  has(productId: number): boolean {
    return this.ids().includes(productId);
  }

  /** Returns true when the product ended up saved. */
  toggle(product: Product): boolean {
    const saved = this.has(product.id);
    this.ids.update((list) =>
      saved ? list.filter((id) => id !== product.id) : [...list, product.id],
    );
    return !saved;
  }

  remove(productId: number): void {
    this.ids.update((list) => list.filter((id) => id !== productId));
  }

  clear(): void {
    this.ids.set([]);
  }
}
