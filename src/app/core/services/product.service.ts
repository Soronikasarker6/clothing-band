import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CATEGORIES, PRODUCTS } from '../config/catalog.data';
import type {
  Category,
  Gender,
  Paginated,
  Product,
  ProductQuery,
  ProductSort,
} from '../models/catalog.model';

/** Simulated latency so loading and skeleton states are exercised in development. */
const MOCK_LATENCY_MS = 320;

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/products`;

  /** GET /api/products */
  list(query: ProductQuery = {}): Observable<Paginated<Product>> {
    if (environment.useMockData) {
      return of(paginate(applyQuery(PRODUCTS, query), query)).pipe(delay(MOCK_LATENCY_MS));
    }
    return this.http.get<Paginated<Product>>(this.base, { params: toParams(query) });
  }

  /** GET /api/products/{slug} */
  bySlug(slug: string): Observable<Product | undefined> {
    if (environment.useMockData) {
      return of(PRODUCTS.find((p) => p.slug === slug)).pipe(delay(MOCK_LATENCY_MS));
    }
    return this.http.get<Product>(`${this.base}/${slug}`);
  }

  newArrivals(limit = 8): Observable<readonly Product[]> {
    return this.list({ sort: 'newest', perPage: limit }).pipe(
      map((page) => page.items.filter((p) => p.isNew).slice(0, limit)),
      map((items) => (items.length ? items : PRODUCTS.slice(0, limit))),
    );
  }

  featured(limit = 4): Observable<readonly Product[]> {
    return this.list({ sort: 'featured', perPage: 60 }).pipe(
      map((page) => page.items.filter((p) => p.featured).slice(0, limit)),
    );
  }

  trending(limit = 8): Observable<readonly Product[]> {
    return this.list({ sort: 'rating', perPage: 60 }).pipe(
      map((page) => page.items.filter((p) => p.trending).slice(0, limit)),
    );
  }

  /** Same category first, then the rest of the gender, excluding the product itself. */
  related(product: Product, limit = 4): Observable<readonly Product[]> {
    return this.list({ gender: product.gender, perPage: 60 }).pipe(
      map((page) => {
        const pool = page.items.filter((p) => p.id !== product.id);
        const sameCategory = pool.filter((p) => p.categorySlug === product.categorySlug);
        const rest = pool.filter((p) => p.categorySlug !== product.categorySlug);
        return [...sameCategory, ...rest].slice(0, limit);
      }),
    );
  }

  /** GET /api/categories */
  categories(gender?: Gender): Observable<readonly Category[]> {
    if (environment.useMockData) {
      const items = gender ? CATEGORIES.filter((c) => c.gender === gender) : CATEGORIES;
      return of(items).pipe(delay(MOCK_LATENCY_MS / 2));
    }
    const params = gender ? new HttpParams().set('gender', gender) : undefined;
    return this.http.get<readonly Category[]>(`${environment.apiBaseUrl}/categories`, { params });
  }

  /** Lightweight typeahead used by the search overlay. */
  suggest(term: string, limit = 6): Observable<readonly Product[]> {
    const needle = term.trim().toLowerCase();
    if (!needle) return of([]);
    if (environment.useMockData) {
      return of(matches(PRODUCTS, needle).slice(0, limit)).pipe(delay(160));
    }
    return this.http.get<readonly Product[]>(`${this.base}/suggest`, {
      params: new HttpParams().set('q', term).set('limit', limit),
    });
  }
}

/* -------------------------------------------------------------- mock helpers */

function matches(products: readonly Product[], needle: string): readonly Product[] {
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.categoryName.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle) ||
      p.colors.some((c) => c.name.toLowerCase().includes(needle)),
  );
}

function effectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}

const SORTERS: Record<ProductSort, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
  newest: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id,
  'price-asc': (a, b) => effectivePrice(a) - effectivePrice(b),
  'price-desc': (a, b) => effectivePrice(b) - effectivePrice(a),
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export function applyQuery(source: readonly Product[], query: ProductQuery): readonly Product[] {
  let items = [...source];

  if (query.gender) items = items.filter((p) => p.gender === query.gender);
  if (query.categorySlug) items = items.filter((p) => p.categorySlug === query.categorySlug);
  if (query.sizes?.length) {
    items = items.filter((p) => query.sizes!.some((size) => p.sizes.includes(size)));
  }
  if (query.colorIds?.length) {
    items = items.filter((p) => p.colors.some((c) => query.colorIds!.includes(c.id)));
  }
  if (query.minPrice != null) items = items.filter((p) => effectivePrice(p) >= query.minPrice!);
  if (query.maxPrice != null) items = items.filter((p) => effectivePrice(p) <= query.maxPrice!);
  if (query.inStockOnly) items = items.filter((p) => p.stock > 0);
  if (query.search) items = [...matches(items, query.search.trim().toLowerCase())];

  return items.sort(SORTERS[query.sort ?? 'featured']);
}

export function paginate(items: readonly Product[], query: ProductQuery): Paginated<Product> {
  const perPage = query.perPage ?? 12;
  const page = Math.max(1, query.page ?? 1);
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(items.length / perPage)),
  };
}

function toParams(query: ProductQuery): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(query)) {
    if (value == null || value === '') continue;
    params = params.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }
  return params;
}
