import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { CartDrawerComponent } from './layout/cart-drawer/cart-drawer.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MobileMenuComponent } from './layout/mobile-menu/mobile-menu.component';
import { SearchOverlayComponent } from './layout/search-overlay/search-overlay.component';
import { QuickViewComponent } from './shared/components/quick-view/quick-view.component';
import { ToastHostComponent } from './shared/components/toast-host/toast-host.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MobileMenuComponent,
    CartDrawerComponent,
    SearchOverlayComponent,
    QuickViewComponent,
    ToastHostComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80]
        focus:bg-ink focus:px-5 focus:py-3 focus:font-sans focus:text-xs focus:uppercase
        focus:tracking-[0.2em] focus:text-paper"
    >
      Skip to content
    </a>

    <app-header />

    <main id="main" [class]="mainPadding()">
      <router-outlet />
    </main>

    <app-footer />

    <app-mobile-menu />
    <app-cart-drawer />
    <app-search-overlay />
    <app-quick-view />
    <app-toast-host />
  `,
})
export class App {
  private readonly router = inject(Router);
  private readonly url = signal('/');

  /** The homepage hero runs under the fixed header; every other page clears it. */
  protected readonly mainPadding = computed(() => (this.url() === '/' ? '' : 'pt-16 lg:pt-20'));

  constructor() {
    // GitHub Pages has no server-side rewrites, so public/404.html redirects hard-refreshed
    // deep links here as `?redirect=<original path>`. Restore the real route once, up front.
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect) {
      this.router.navigateByUrl(redirect, { replaceUrl: true });
    }

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects.split('?')[0]),
        startWith(this.router.url.split('?')[0]),
        takeUntilDestroyed(),
      )
      .subscribe((url) => this.url.set(url));
  }
}
