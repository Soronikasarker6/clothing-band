import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { environment } from '../../../environments/environment';
import { COLOR_MAP } from '../config/site.config';
import type { AddToCartRequest, CartLine, CartTotals } from '../models/cart.model';
import type { Product, SizeCode } from '../models/catalog.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'maison.cart.v1';

/**
 * Cart state lives in signals; the UI reads computed values and never mutates
 * lines directly. Persistence is a side effect, not part of the public surface.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);
  private readonly items = signal<readonly CartLine[]>(
    this.storage.read<readonly CartLine[]>(STORAGE_KEY, []),
  );

  /** Promo code applied at checkout, if any. */
  private readonly promo = signal<{ code: string; rate: number } | null>(null);

  readonly lines = this.items.asReadonly();
  readonly count = computed(() => this.items().reduce((total, line) => total + line.quantity, 0));
  readonly isEmpty = computed(() => this.items().length === 0);

  readonly totals = computed<CartTotals>(() => {
    const subtotal = this.items().reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const discount = round(subtotal * (this.promo()?.rate ?? 0));
    const net = subtotal - discount;
    const shipping =
      net === 0 || net >= environment.freeShippingThreshold ? 0 : environment.flatShippingRate;
    return {
      subtotal: round(subtotal),
      shipping,
      discount,
      total: round(net + shipping),
      itemCount: this.count(),
    };
  });

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.items()));
  }

  add({ product, size, colorId, quantity }: AddToCartRequest): void {
    const key = lineKey(product.id, size, colorId);
    const max = stockFor(product, size, colorId);
    const existing = this.items().find((line) => line.key === key);

    if (existing) {
      this.setQuantity(key, existing.quantity + quantity);
      return;
    }

    const image =
      product.images.find((img) => img.colorId === colorId)?.url ?? product.images[0]?.url ?? '';

    const line: CartLine = {
      key,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      categoryName: product.categoryName,
      image,
      unitPrice: product.salePrice ?? product.price,
      size,
      colorId,
      colorName: COLOR_MAP.get(colorId)?.name ?? colorId,
      quantity: Math.min(quantity, Math.max(1, max)),
      maxQuantity: Math.max(1, max),
    };
    this.items.update((lines) => [...lines, line]);
  }

  setQuantity(key: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(key);
      return;
    }
    this.items.update((lines) =>
      lines.map((line) =>
        line.key === key ? { ...line, quantity: Math.min(quantity, line.maxQuantity) } : line,
      ),
    );
  }

  increment(key: string): void {
    const line = this.items().find((l) => l.key === key);
    if (line) this.setQuantity(key, line.quantity + 1);
  }

  decrement(key: string): void {
    const line = this.items().find((l) => l.key === key);
    if (line) this.setQuantity(key, line.quantity - 1);
  }

  remove(key: string): void {
    this.items.update((lines) => lines.filter((line) => line.key !== key));
  }

  clear(): void {
    this.items.set([]);
    this.promo.set(null);
  }

  applyPromo(code: string): boolean {
    const normalised = code.trim().toUpperCase();
    // Mocked until the Laravel discount endpoint exists.
    const known: Record<string, number> = { ATELIER10: 0.1, WELCOME15: 0.15 };
    if (!(normalised in known)) return false;
    this.promo.set({ code: normalised, rate: known[normalised] });
    return true;
  }
}

export function lineKey(productId: number, size: SizeCode, colorId: string): string {
  return `${productId}::${size}::${colorId}`;
}

export function stockFor(product: Product, size: SizeCode, colorId: string): number {
  return product.variants.find((v) => v.size === size && v.colorId === colorId)?.stock ?? 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
