import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import type { SizeCode } from '../../../core/models/catalog.model';
import { CartService, stockFor } from '../../../core/services/cart.service';
import { QuickViewService } from '../../../core/services/quick-view.service';
import { ToastService } from '../../../core/services/toast.service';
import { UiService } from '../../../core/services/ui.service';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { ICONS } from '../../icons';
import { MoneyPipe } from '../../pipes/money.pipe';
import { ColorSelectorComponent } from '../color-selector/color-selector.component';
import { RatingComponent } from '../rating/rating.component';
import { SizeSelectorComponent } from '../size-selector/size-selector.component';

/** Lightweight product dialog opened from any product card. */
@Component({
  selector: 'app-quick-view',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    MoneyPipe,
    ImageFallbackDirective,
    ColorSelectorComponent,
    SizeSelectorComponent,
    RatingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  templateUrl: './quick-view.component.html',
})
export class QuickViewComponent {
  private readonly quickView = inject(QuickViewService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly ui = inject(UiService);

  protected readonly icons = ICONS;
  protected readonly product = this.quickView.product;
  protected readonly isOpen = this.quickView.isOpen;

  protected readonly color = signal<string>('');
  protected readonly size = signal<SizeCode | null>(null);

  protected readonly image = computed(() => {
    const product = this.product();
    if (!product) return null;
    return product.images.find((img) => img.colorId === this.color()) ?? product.images[0];
  });

  protected readonly unavailableSizes = computed<readonly SizeCode[]>(() => {
    const product = this.product();
    if (!product) return [];
    return product.sizes.filter((size) => stockFor(product, size, this.color()) === 0);
  });

  constructor() {
    // Reset the selection whenever a different product is opened.
    effect(() => {
      const product = this.product();
      if (!product) return;
      this.color.set(product.colors[0]?.id ?? '');
      this.size.set(null);
    });
  }

  protected close(): void {
    this.quickView.close();
  }

  protected addToCart(): void {
    const product = this.product();
    const size = this.size();
    if (!product || !size) return;

    this.cart.add({ product, size, colorId: this.color(), quantity: 1 });
    this.toast.show('Added to bag', `${product.name} — ${size}`, 'success');
    this.close();
    this.ui.open('cart');
  }
}
