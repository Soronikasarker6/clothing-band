import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type Overlay = 'menu' | 'cart' | 'search' | null;

/**
 * Owns the shell's transient UI state — mobile menu, cart drawer and search.
 * Only one overlay is ever open, and the document scroll lock follows it.
 */
@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly doc = inject(DOCUMENT);
  private readonly overlay = signal<Overlay>(null);

  readonly activeOverlay = this.overlay.asReadonly();
  readonly menuOpen = computed(() => this.overlay() === 'menu');
  readonly cartOpen = computed(() => this.overlay() === 'cart');
  readonly searchOpen = computed(() => this.overlay() === 'search');
  readonly anyOpen = computed(() => this.overlay() !== null);

  constructor() {
    effect(() => {
      const locked = this.overlay() !== null;
      this.doc.body.classList.toggle('overflow-hidden', locked);
    });
  }

  open(overlay: Exclude<Overlay, null>): void {
    this.overlay.set(overlay);
  }

  toggle(overlay: Exclude<Overlay, null>): void {
    this.overlay.update((current) => (current === overlay ? null : overlay));
  }

  close(): void {
    this.overlay.set(null);
  }
}
