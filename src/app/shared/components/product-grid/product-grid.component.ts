import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Product } from '../../../core/models/catalog.model';
import { RevealDirective } from '../../directives/reveal.directive';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardSkeletonComponent } from './product-card-skeleton.component';

/**
 * Responsive product grid with loading and empty states built in, so no page
 * ever renders a blank area while the catalogue is in flight.
 */
@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent, ProductCardSkeletonComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div [class]="gridClass()">
        @for (item of skeletons(); track $index) {
          <app-product-card-skeleton />
        }
      </div>
    } @else if (products().length === 0) {
      <div class="border border-ink/10 px-6 py-20 text-center">
        <p class="font-display text-2xl text-ink">{{ emptyTitle() }}</p>
        <p class="mx-auto mt-3 max-w-sm font-sans text-sm text-stone">{{ emptyBody() }}</p>
      </div>
    } @else {
      <div [class]="gridClass()">
        @for (product of products(); track product.id) {
          <div [appReveal]="$index * 70">
            <app-product-card [product]="product" [priority]="$index < 4 && eagerFirstRow()" />
          </div>
        }
      </div>
    }
  `,
})
export class ProductGridComponent {
  readonly products = input.required<readonly Product[]>();
  readonly loading = input<boolean>(false);
  readonly skeletonCount = input<number>(4);
  readonly eagerFirstRow = input<boolean>(false);
  readonly emptyTitle = input<string>('Nothing here yet');
  readonly emptyBody = input<string>(
    'Try widening your filters, or browse the full collection to find your piece.',
  );
  /** Override for layouts that need a different column rhythm. */
  readonly gridClass = input<string>(
    'grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16',
  );

  protected skeletons(): readonly number[] {
    return Array.from({ length: this.skeletonCount() }, (_, i) => i);
  }
}
