import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { filter, map, startWith } from 'rxjs';

import { PRIMARY_NAV } from '../../core/config/site.config';
import { media } from '../../core/config/media.config';
import { CartService } from '../../core/services/cart.service';
import { UiService } from '../../core/services/ui.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);

  protected readonly icons = ICONS;
  protected readonly nav = PRIMARY_NAV;
  protected readonly cartCount = this.cart.count;
  protected readonly wishlistCount = this.wishlist.count;
  protected readonly menuOpen = this.ui.menuOpen;

  /** Which mega-menu panel is currently expanded, if any. */
  protected readonly openPanel = signal<string | null>(null);
  protected readonly scrolled = signal(false);

  private readonly currentUrl = signal('/');

  /** The header floats over the homepage hero until the page is scrolled. */
  protected readonly transparent = computed(
    () => this.currentUrl() === '/' && !this.scrolled() && !this.menuOpen(),
  );

  protected readonly shellClasses = computed(() =>
    this.transparent()
      ? 'border-transparent bg-transparent'
      : 'border-ink/10 bg-paper/92 backdrop-blur-md',
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects.split('?')[0]),
        startWith(this.router.url.split('?')[0]),
        takeUntilDestroyed(),
      )
      .subscribe((url) => {
        this.currentUrl.set(url);
        this.openPanel.set(null);
      });
  }

  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  protected mediaUrl(key: string): string {
    return media(key, { width: 640, ratio: '3:4' });
  }

  protected openSearch(): void {
    this.ui.open('search');
  }

  protected openCart(): void {
    this.ui.open('cart');
  }

  protected toggleMenu(): void {
    this.ui.toggle('menu');
  }

  protected setPanel(label: string | null): void {
    this.openPanel.set(label);
  }
}
