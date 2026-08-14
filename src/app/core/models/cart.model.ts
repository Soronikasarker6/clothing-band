import type { Product, SizeCode } from './catalog.model';

export interface CartLine {
  /** Composite key: product + size + colour, so variants stack independently. */
  readonly key: string;
  readonly productId: number;
  readonly slug: string;
  readonly name: string;
  readonly categoryName: string;
  readonly image: string;
  readonly unitPrice: number;
  readonly size: SizeCode;
  readonly colorId: string;
  readonly colorName: string;
  readonly quantity: number;
  readonly maxQuantity: number;
}

export interface CartTotals {
  readonly subtotal: number;
  readonly shipping: number;
  readonly discount: number;
  readonly total: number;
  readonly itemCount: number;
}

export interface AddToCartRequest {
  readonly product: Product;
  readonly size: SizeCode;
  readonly colorId: string;
  readonly quantity: number;
}
