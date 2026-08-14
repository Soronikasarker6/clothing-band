import type { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';

/**
 * Every feature is lazy-loaded, so the homepage ships only the shell plus the
 * home bundle. URLs stay clean and slug-based for SEO.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
    title: 'Maison Atelier — Premium Fashion Showroom',
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
  },
  {
    path: 'new-arrivals',
    loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
    data: { mode: 'new' },
  },
  {
    path: 'sale',
    loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
    data: { mode: 'sale' },
  },
  {
    path: 'men',
    data: { gender: 'men' },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
        data: { gender: 'men' },
      },
      {
        path: ':category',
        loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
        data: { gender: 'men' },
      },
    ],
  },
  {
    path: 'women',
    data: { gender: 'women' },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
        data: { gender: 'women' },
      },
      {
        path: ':category',
        loadComponent: () => import('./features/shop/shop.page').then((m) => m.ShopPage),
        data: { gender: 'women' },
      },
    ],
  },
  {
    path: 'product/:slug',
    loadComponent: () =>
      import('./features/products/product-detail.page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.page').then((m) => m.WishlistPage),
  },

  /* ---- Modules scheduled for the next milestones ---- */
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: {
      eyebrow: 'Bag',
      title: 'The full bag page is next',
      body: 'Your bag is live in the drawer — open it from the header. The full page, with saved-for-later and promo codes, lands in the cart milestone.',
    },
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: {
      eyebrow: 'Checkout',
      title: 'Checkout is in build',
      body: 'A four-step checkout — information, shipping, payment and review — is the next module, structured so a real payment gateway drops in cleanly.',
    },
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: {
      eyebrow: 'Account',
      title: 'Your account area is on the way',
      body: 'Profile, orders, addresses and settings arrive with the authentication module.',
    },
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: {
      eyebrow: 'Collections',
      title: 'Collection stories are being written',
      body: 'Seasonal edits with full editorial layouts. In the meantime, the whole catalogue is in the shop.',
    },
  },
  {
    path: 'collections/:slug',
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: { eyebrow: 'Collections', title: 'This edit is coming soon' },
  },
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: { eyebrow: 'Admin', title: 'Dashboard in build' },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/coming-soon/coming-soon.page').then((m) => m.ComingSoonPage),
    data: {
      eyebrow: '404',
      title: 'This page has moved on',
      body: 'The link may be out of season. Everything currently in the showroom is one click away.',
    },
  },
];
