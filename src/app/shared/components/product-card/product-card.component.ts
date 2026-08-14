import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import type { Product } from '../../../core/models/catalog.model';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { ICONS } from '../../icons';
import { MoneyPipe } from '../../pipes/money.pipe';

/**
 * The catalogue's single product tile. Used by every grid, carousel and rail in
 * the showroom — nothing re-implements this markup.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, MoneyPipe, ImageFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  /** Above-the-fold tiles load eagerly; everything else defers. */
  readonly priority = input<boolean>(false);

  private readonly wishlist = inject(WishlistService);
  private readonly quickView = inject(QuickViewService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;

  protected readonly link = computed(() => ['/product', this.product().slug]);
  protected readonly primaryImage = computed(() => this.product().images[0]);
  protected readonly hoverImage = computed(
    () => this.product().images[1] ?? this.product().images[0],
  );
  protected readonly price = computed(() => this.product().salePrice ?? this.product().price);
  protected readonly onSale = computed(() => this.product().salePrice !== null);
  protected readonly soldOut = computed(() => this.product().stock === 0);
  protected readonly saved = computed(() => this.wishlist.productIds().includes(this.product().id));

  protected toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const added = this.wishlist.toggle(this.product());
    this.toast.show(
      added ? 'Saved to wishlist' : 'Removed from wishlist',
      this.product().name,
      'success',
    );
  }

  protected openQuickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.quickView.open(this.product());
  }
}
