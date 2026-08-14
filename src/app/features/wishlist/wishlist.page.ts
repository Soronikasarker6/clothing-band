import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductGridComponent } from '../../shared/components/product-grid/product-grid.component';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [RouterLink, ProductGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="border-b border-ink/10 bg-cream">
      <div class="shell py-16 lg:py-24">
        <p class="eyebrow">Saved</p>
        <h1 class="mt-5 font-display text-display-sm uppercase text-ink lg:text-display-md">
          Wishlist
        </h1>
        <p class="mt-5 max-w-md font-sans text-base leading-relaxed text-slate">
          Pieces you're considering. They stay here until you're ready.
        </p>
      </div>
    </section>

    <section class="shell py-16 lg:py-20">
      @if (!loading() && saved().length === 0) {
        <div class="mx-auto max-w-md py-16 text-center">
          <p class="font-display text-2xl text-ink">Nothing saved yet</p>
          <p class="mt-3 font-sans text-sm text-stone">
            Tap the heart on any piece to keep it here for later.
          </p>
          <a routerLink="/shop" class="btn-solid mt-10">Browse the collection</a>
        </div>
      } @else {
        <app-product-grid
          [products]="saved()"
          [loading]="loading()"
          [skeletonCount]="4"
          [eagerFirstRow]="true"
        />
      }
    </section>
  `,
})
export class WishlistPage {
  private readonly products = inject(ProductService);
  private readonly wishlist = inject(WishlistService);
  private readonly seo = inject(SeoService);

  private readonly all = toSignal(this.products.list({ perPage: 100 }), { initialValue: null });

  protected readonly loading = computed(() => this.all() === null);
  protected readonly saved = computed(() => {
    const page = this.all();
    if (!page) return [];
    const ids = this.wishlist.productIds();
    return page.items.filter((product) => ids.includes(product.id));
  });

  constructor() {
    this.seo.apply({
      title: 'Wishlist',
      description: 'The pieces you have saved from the Maison Atelier collection.',
      canonicalPath: '/wishlist',
    });
  }
}
