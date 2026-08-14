import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, shareReplay, startWith, switchMap, type Observable } from 'rxjs';

import { CATEGORIES } from '../../core/config/catalog.data';
import type { Gender, ProductSort } from '../../core/models/catalog.model';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

interface ShopRouteContext {
  readonly gender?: Gender;
  readonly categorySlug?: string;
  readonly search?: string;
  readonly mode?: 'new' | 'sale';
}

const SORT_OPTIONS: readonly { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

/**
 * Listing page shared by /shop, /men, /women, /men/:category, /new-arrivals and
 * /sale. Filters arrive as route params or query params so every view is
 * linkable and refresh-safe.
 */
@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [RouterLink, ProductGridComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop.page.html',
})
export class ShopPage {
  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductService);
  private readonly seo = inject(SeoService);

  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly sort = signal<ProductSort>('featured');

  /** Everything the listing needs, derived from the URL rather than component state. */
  private readonly context$: Observable<ShopRouteContext> = combineLatest([
    this.route.paramMap,
    this.route.queryParamMap,
    this.route.data,
  ]).pipe(
    map(([params, query, data]) => ({
      gender: data['gender'] as Gender | undefined,
      categorySlug: params.get('category') ?? undefined,
      search: query.get('search') ?? undefined,
      mode: data['mode'] as 'new' | 'sale' | undefined,
    })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private readonly context = toSignal(this.context$, { initialValue: {} as ShopRouteContext });

  private readonly result = toSignal(
    this.context$.pipe(
      switchMap((context) =>
        this.products
          .list({
            gender: context.gender,
            categorySlug: context.categorySlug,
            search: context.search,
            perPage: 60,
          })
          .pipe(startWith(null)),
      ),
    ),
    { initialValue: null },
  );

  protected readonly loading = computed(() => this.result() === null);

  protected readonly items = computed(() => {
    const page = this.result();
    if (!page) return [];
    const mode = this.context().mode;
    let items = [...page.items];
    if (mode === 'new') items = items.filter((p) => p.isNew);
    if (mode === 'sale') items = items.filter((p) => p.salePrice !== null);
    return items;
  });

  protected readonly category = computed(() => {
    const { gender, categorySlug } = this.context();
    if (!categorySlug) return undefined;
    return CATEGORIES.find((c) => c.slug === categorySlug && (!gender || c.gender === gender));
  });

  protected readonly title = computed(() => {
    const { gender, mode, search } = this.context();
    if (search) return `Results for “${search}”`;
    if (mode === 'new') return 'New Arrivals';
    if (mode === 'sale') return 'Sale';
    const category = this.category();
    if (category) return `${gender === 'men' ? "Men's" : "Women's"} ${category.name}`;
    if (gender) return gender === 'men' ? "Men's Collection" : "Women's Collection";
    return 'All Collections';
  });

  protected readonly description = computed(
    () => this.category()?.description ?? 'Discover our latest pieces.',
  );

  protected readonly siblingCategories = computed(() => {
    const gender = this.context().gender;
    return gender ? CATEGORIES.filter((c) => c.gender === gender) : [];
  });

  constructor() {
    this.seo.apply({
      title: 'Shop the collection',
      description: 'Browse the full Maison Atelier collection for men and women.',
      canonicalPath: '/shop',
    });
  }

  protected setSort(value: string): void {
    this.sort.set(value as ProductSort);
  }

  protected readonly sorted = computed(() => {
    const items = [...this.items()];
    const price = (p: (typeof items)[number]) => p.salePrice ?? p.price;
    switch (this.sort()) {
      case 'newest':
        return items.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
      case 'price-asc':
        return items.sort((a, b) => price(a) - price(b));
      case 'price-desc':
        return items.sort((a, b) => price(b) - price(a));
      case 'rating':
        return items.sort((a, b) => b.rating - a.rating);
      default:
        return items.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }
  });
}
