import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Product } from '../../../core/models/catalog.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../../shared/components/product-grid/product-card-skeleton.component';

/**
 * Horizontally scrolling rail on small screens, a four-up grid from `lg`.
 * Used for trending pieces where a full grid would over-weight the page.
 */
@Component({
  selector: 'app-product-rail',
  standalone: true,
  imports: [ProductCardComponent, ProductCardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2
        sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0"
      role="list"
    >
      @if (loading()) {
        @for (item of skeletons; track $index) {
          <div class="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto" role="listitem">
            <app-product-card-skeleton />
          </div>
        }
      } @else {
        @for (product of products(); track product.id) {
          <div class="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto" role="listitem">
            <app-product-card [product]="product" />
          </div>
        }
      }
    </div>
  `,
})
export class ProductRailComponent {
  readonly products = input.required<readonly Product[]>();
  readonly loading = input<boolean>(false);

  protected readonly skeletons = [0, 1, 2, 3];
}
