import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cart.service';
import { UiService } from '../../core/services/ui.service';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ICONS } from '../../shared/icons';
import { MoneyPipe } from '../../shared/pipes/money.pipe';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, MoneyPipe, ImageFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  private readonly ui = inject(UiService);
  private readonly cart = inject(CartService);

  protected readonly icons = ICONS;
  protected readonly open = this.ui.cartOpen;
  protected readonly lines = this.cart.lines;
  protected readonly totals = this.cart.totals;
  protected readonly freeShippingThreshold = environment.freeShippingThreshold;

  protected close(): void {
    this.ui.close();
  }

  protected increment(key: string): void {
    this.cart.increment(key);
  }

  protected decrement(key: string): void {
    this.cart.decrement(key);
  }

  protected remove(key: string): void {
    this.cart.remove(key);
  }

  protected remainingForFreeShipping(): number {
    return Math.max(0, this.freeShippingThreshold - this.totals().subtotal);
  }
}
