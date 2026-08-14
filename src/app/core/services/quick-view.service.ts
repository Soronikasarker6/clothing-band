import { Injectable, computed, signal } from '@angular/core';

import type { Product } from '../models/catalog.model';

/** Holds whichever product the quick-view dialog is currently showing. */
@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly current = signal<Product | null>(null);

  readonly product = this.current.asReadonly();
  readonly isOpen = computed(() => this.current() !== null);

  open(product: Product): void {
    this.current.set(product);
  }

  close(): void {
    this.current.set(null);
  }
}
