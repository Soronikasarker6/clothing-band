import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { map, of, shareReplay, startWith, switchMap } from 'rxjs';

import type { Product, SizeCode } from '../../core/models/catalog.model';
import { CartService, stockFor } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { UiService } from '../../core/services/ui.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ColorSelectorComponent } from '../../shared/components/color-selector/color-selector.component';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid.component';
import { QuantitySelectorComponent } from '../../shared/components/quantity-selector/quantity-selector.component';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { SizeSelectorComponent } from '../../shared/components/size-selector/size-selector.component';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ICONS } from '../../shared/icons';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    MoneyPipe,
    ImageFallbackDirective,
    RevealDirective,
    RatingComponent,
    ColorSelectorComponent,
    SizeSelectorComponent,
    QuantitySelectorComponent,
    ProductGridComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.page.html',
})
export class ProductDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly toast = inject(ToastService);
  private readonly ui = inject(UiService);
  private readonly seo = inject(SeoService);

  protected readonly icons = ICONS;

  private readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('slug') ?? ''),
    switchMap((slug) =>
      this.service.bySlug(slug).pipe(
        map((product) => product ?? null),
        startWith(undefined),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** `undefined` while in flight, `null` when the slug does not resolve. */
  protected readonly product = toSignal<Product | null | undefined>(this.product$, {
    initialValue: undefined,
  });
  protected readonly loading = computed(() => this.product() === undefined);
  protected readonly notFound = computed(() => this.product() === null);

  protected readonly related = toSignal(
    this.product$.pipe(
      switchMap((product) => (product ? this.service.related(product, 4) : of([]))),
    ),
    { initialValue: [] as readonly Product[] },
  );

  protected readonly color = signal<string>('');
  protected readonly size = signal<SizeCode | null>(null);
  protected readonly quantity = signal(1);
  protected readonly showSizeGuide = signal(false);
  protected readonly openPanel = signal<string | null>('details');

  protected readonly saved = computed(() => {
    const product = this.product();
    return product ? this.wishlist.productIds().includes(product.id) : false;
  });

  protected readonly unavailableSizes = computed<readonly SizeCode[]>(() => {
    const product = this.product();
    if (!product) return [];
    return product.sizes.filter((size) => stockFor(product, size, this.color()) === 0);
  });

  protected readonly maxQuantity = computed(() => {
    const product = this.product();
    const size = this.size();
    if (!product || !size) return 1;
    return Math.max(1, Math.min(10, stockFor(product, size, this.color())));
  });

  protected readonly gallery = computed(() => this.product()?.images ?? []);

  protected readonly selectedColorName = computed(
    () => this.product()?.colors.find((c) => c.id === this.color())?.name ?? '',
  );

  protected readonly panels = [
    { id: 'details', label: 'Product details' },
    { id: 'care', label: 'Care instructions' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
  ] as const;

  constructor() {
    effect(() => {
      const product = this.product();
      if (!product) return;
      this.color.set(product.colors[0]?.id ?? '');
      this.size.set(null);
      this.quantity.set(1);

      this.seo.apply({
        title: product.name,
        description: product.description,
        image: product.images[0]?.url,
        canonicalPath: `/product/${product.slug}`,
        type: 'product',
      });
      this.seo.setStructuredData('product', {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        sku: product.sku,
        description: product.description,
        image: product.images.map((image) => image.url),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
        offers: {
          '@type': 'Offer',
          price: product.salePrice ?? product.price,
          priceCurrency: product.currency,
          availability:
            product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      });
    });
  }

  protected togglePanel(panel: string): void {
    this.openPanel.update((current) => (current === panel ? null : panel));
  }

  protected toggleWishlist(): void {
    const product = this.product();
    if (!product) return;
    const added = this.wishlist.toggle(product);
    this.toast.show(added ? 'Saved to wishlist' : 'Removed from wishlist', product.name, 'success');
  }

  protected addToCart(openDrawer = true): void {
    const product = this.product();
    const size = this.size();
    if (!product || !size) return;

    this.cart.add({ product, size, colorId: this.color(), quantity: this.quantity() });
    this.toast.show('Added to bag', `${product.name} — ${size}`, 'success');
    if (openDrawer) this.ui.open('cart');
  }

  protected buyNow(): void {
    this.addToCart(false);
    if (this.size()) void this.router.navigate(['/checkout']);
  }
}
