/** Shared catalogue domain types. These mirror the Laravel API resources 1:1. */

export type Gender = 'men' | 'women' | 'unisex';

export type SizeCode = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorOption {
  /** Stable identifier used by variants and query params, e.g. `off-white`. */
  readonly id: string;
  readonly name: string;
  /** CSS colour used for the swatch dot. */
  readonly swatch: string;
  /** Swatches on near-white colours need a hairline to stay visible. */
  readonly needsBorder?: boolean;
}

export interface ProductImage {
  readonly url: string;
  readonly alt: string;
  /** Optional colour this shot belongs to, so the gallery can follow the selection. */
  readonly colorId?: string;
}

export interface ProductVariant {
  readonly id: number;
  readonly size: SizeCode;
  readonly colorId: string;
  readonly stock: number;
}

export interface Category {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly gender: Gender;
  readonly description?: string;
  readonly image?: string;
}

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly categorySlug: string;
  readonly categoryName: string;
  readonly gender: Gender;
  readonly description: string;
  readonly price: number;
  readonly salePrice: number | null;
  readonly sku: string;
  readonly currency: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly images: readonly ProductImage[];
  readonly colors: readonly ColorOption[];
  readonly sizes: readonly SizeCode[];
  readonly variants: readonly ProductVariant[];
  readonly stock: number;
  readonly featured: boolean;
  readonly isNew: boolean;
  readonly trending: boolean;
  readonly details: ProductDetails;
}

export interface ProductDetails {
  readonly material: string;
  readonly fit: string;
  readonly care: readonly string[];
  readonly shipping: string;
  readonly returns: string;
}

export interface ProductQuery {
  readonly gender?: Gender;
  readonly categorySlug?: string;
  readonly sizes?: readonly SizeCode[];
  readonly colorIds?: readonly string[];
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly inStockOnly?: boolean;
  readonly search?: string;
  readonly sort?: ProductSort;
  readonly page?: number;
  readonly perPage?: number;
}

export type ProductSort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface Paginated<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
  readonly totalPages: number;
}
