# Maison Atelier — Premium Fashion Showroom

An Angular 20 + Tailwind CSS 4 storefront for a premium clothing brand, designed to read like a
fashion house rather than an e-commerce template. This repository is milestone 1: the frontend
foundation, the design system, the shared component library and a complete homepage — plus a
working listing page, product detail page, wishlist, cart drawer and search overlay.

---

## 1. Quick start

```bash
npm install
npm start           # http://localhost:4200
npm run build       # production build → dist/maison-atelier/browser
```

No backend is required to run the app. `environment.useMockData` is `true`, so `ProductService`
serves the in-repo catalogue through the exact same method signatures the Laravel API will use.
Flip that flag and point `apiBaseUrl` at Laravel to switch over — no component changes.

---

## 2. Proposed architecture

**Frontend.** Angular standalone components throughout, no NgModules. Every route is lazily
loaded. State lives in injectable services built on signals; RxJS is used where the problem is
genuinely a stream (route params, debounced search, HTTP). Components are presentational and read
state through `computed()`.

**Layering.**

| Layer | Responsibility | Rule |
| --- | --- | --- |
| `core/` | Models, configuration, services, guards, interceptors | Never imports from `features/` |
| `shared/` | Reusable presentational components, directives, pipes | No feature knowledge, no routing decisions |
| `layout/` | The persistent shell — header, drawers, overlays, footer | Renders once, in `App` |
| `features/` | Route-level pages | Composes `shared/`, reads `core/` |

**Backend.** Laravel exposes a versioned REST API. Controllers stay thin; anything with business
rules (pricing, stock reservation, order placement) lives in a service class. Every response goes
through an API Resource so the JSON contract is explicit and the Angular models mirror it exactly.

**Contract discipline.** `core/models/catalog.model.ts` is the single source of truth for the shape
of a product. The Laravel `ProductResource` returns exactly these keys. When the contract changes,
both sides change together.

---

## 3. Folder structure

```
src/
├── environments/
│   ├── environment.ts                 # dev — API URL, mock flag, currency, shipping rules
│   └── environment.production.ts
└── app/
    ├── core/
    │   ├── config/
    │   │   ├── media.config.ts        # ← every image URL in the app resolves here
    │   │   ├── site.config.ts         # brand, navigation tree, colours, sizes
    │   │   └── catalog.data.ts        # development catalogue (mirrors the API payload)
    │   ├── guards/admin.guard.ts
    │   ├── interceptors/api.interceptor.ts
    │   ├── models/                    # catalog, cart, order, user, environment
    │   └── services/
    │       ├── product.service.ts     # list / bySlug / categories / suggest / related
    │       ├── cart.service.ts        # signal store + localStorage + totals
    │       ├── wishlist.service.ts
    │       ├── auth.service.ts        # session state (Sanctum-ready)
    │       ├── search.service.ts      # recent searches
    │       ├── quick-view.service.ts
    │       ├── ui.service.ts          # one-overlay-at-a-time + scroll lock
    │       ├── toast.service.ts
    │       ├── seo.service.ts         # titles, meta, canonical, JSON-LD
    │       └── storage.service.ts
    ├── shared/
    │   ├── components/
    │   │   ├── product-card/          # ProductCardComponent
    │   │   ├── product-grid/          # ProductGridComponent + skeleton
    │   │   ├── quick-view/            # QuickViewComponent
    │   │   ├── color-selector/  size-selector/  quantity-selector/
    │   │   ├── rating/  section-heading/  newsletter/  toast-host/
    │   ├── directives/
    │   │   ├── reveal.directive.ts        # IntersectionObserver fade-in
    │   │   └── image-fallback.directive.ts
    │   ├── pipes/money.pipe.ts
    │   └── icons.ts                   # curated lucide set, tree-shaken
    ├── layout/
    │   ├── header/                    # sticky nav + mega menu
    │   ├── mobile-menu/               # drawer with accordion
    │   ├── cart-drawer/
    │   ├── search-overlay/
    │   └── footer/
    ├── features/
    │   ├── home/                      # home.page + sections/ + home.content.ts
    │   ├── shop/                      # listing: /shop, /men, /women, /:gender/:category
    │   ├── products/                  # product detail
    │   ├── wishlist/
    │   └── coming-soon/               # on-brand holding page for later milestones
    ├── app.ts                         # shell: header, outlet, footer, overlays
    ├── app.config.ts
    └── app.routes.ts
```

---

## 4. Main reusable components

| Component | Notes |
| --- | --- |
| `ProductCardComponent` | Hover image cross-fade, sale/new/sold-out marks, wishlist toggle, quick view, colour dots. Used by every grid and rail — nothing duplicates this markup. |
| `ProductGridComponent` | Responsive grid with loading skeletons, empty state and staggered reveal built in. |
| `ProductRailComponent` | Snap-scrolling rail on mobile, four-up grid from `lg`. |
| `QuickViewComponent` | Dialog with colour + size selection and add-to-bag, driven by `QuickViewService`. |
| `ColorSelectorComponent` / `SizeSelectorComponent` / `QuantitySelectorComponent` | Accessible radiogroups and steppers using `model()` two-way signals. |
| `SectionHeadingComponent` | Eyebrow + display heading + optional trailing link. |
| `RatingComponent`, `NewsletterFormComponent`, `ToastHostComponent` | Rating, reactive-forms capture, toast host. |
| `EditorialPanelComponent`, `CampaignComponent`, `BrandStoryComponent`, `HeroComponent` | Homepage editorial sections, content injected from `home.content.ts`. |
| `RevealDirective`, `ImageFallbackDirective`, `MoneyPipe` | Cross-cutting behaviour. |

---

## 5. Tailwind design system

Defined once in `src/styles.css` via `@theme` and consumed as utilities. No component ships a
stylesheet.

**Palette** — monochrome-first, warm rather than grey.

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#0f0f0e` | Headlines, primary buttons |
| `charcoal` | `#1c1c1a` | Body copy |
| `graphite` / `slate` | `#3a3a37` / `#5c5c57` | Secondary copy |
| `stone` / `ash` | `#8a877f` / `#b9b5ac` | Meta, disabled |
| `sand` / `linen` / `cream` / `paper` | `#d9d1c2` → `#faf8f4` | Surfaces |
| `clay` | `#9c5f45` | The only accent — sale prices and inline errors |

**Type** — `Bodoni Moda` for editorial display, `Jost` for everything else. Both self-hosted via
`@fontsource`, so there is no third-party font request. Display sizes are theme tokens:
`text-display-sm` → `text-display-xl` (2.25rem → 7rem).

**Component utilities** — declared with `@utility` so they compose with `@apply` and with variants:
`btn`, `btn-solid`, `btn-outline`, `btn-ghost`, `btn-light`, `eyebrow`, `link-underline`, `field`,
`shell` (the page gutter), `no-scrollbar`.

**Motion** — `--ease-editorial` (`cubic-bezier(.22,1,.36,1)`) and two keyframe animations,
`fade-up` and `fade-in`. Everything is suppressed under `prefers-reduced-motion`.

---

## 6. API structure

Full contract in [`docs/api-contract.md`](docs/api-contract.md). Summary:

```
GET    /api/products                 ?gender&category&sizes&colors&min_price&max_price
                                     &in_stock&search&sort&page&per_page
GET    /api/products/{slug}
GET    /api/products/suggest         ?q&limit
POST   /api/products                 (admin)
PUT    /api/products/{id}            (admin)
DELETE /api/products/{id}            (admin)

GET    /api/categories               ?gender
GET    /api/categories/{slug}

GET    /api/orders                   (auth)
POST   /api/orders                   (auth)
GET    /api/orders/{reference}       (auth)
PATCH  /api/admin/orders/{id}/status (admin)

GET    /api/wishlist                 (auth)
POST   /api/wishlist                 (auth)
DELETE /api/wishlist/{productId}     (auth)

POST   /api/auth/register | /login | /logout
GET    /api/auth/me

GET    /api/admin/metrics            (admin)
GET    /api/admin/customers          (admin)
```

Laravel layout: `Http/Controllers/Api/*Controller`, `Http/Requests/*Request` for validation,
`Http/Resources/*Resource` for serialisation, `Services/{Catalog,Cart,Order,Inventory}Service` for
business rules, Sanctum for tokens, policies for admin authorisation.

---

## 7. Database structure

Full schema in [`docs/database-schema.md`](docs/database-schema.md). Tables:

`users`, `categories`, `products`, `product_images`, `product_variants`, `carts`, `cart_items`,
`orders`, `order_items`, `addresses`, `wishlists`, `coupons`.

Two deliberate normalisations beyond the brief:

- **`product_variants` owns stock.** Product-level `stock` is a derived sum, not a stored value, so
  size × colour availability is always correct.
- **`order_items` snapshots** name, price, size and colour at purchase time. Orders must stay
  truthful after a product is renamed, repriced or deleted.

---

## 8. What ships in this milestone

- Design system, theme tokens, self-hosted fonts
- Layout shell: sticky header with mega menu, mobile drawer, cart drawer, search overlay, footer
- Shared component library (table in §4)
- **Homepage** — hero, new arrivals, assurances, men's and women's editorials, autumn campaign,
  trending rail, brand story, newsletter
- Listing page serving `/shop`, `/men`, `/women`, `/men/:category`, `/women/:category`,
  `/new-arrivals`, `/sale`
- Product detail page with gallery, selectors, stock states, accordion details, size guide,
  JSON-LD and related products
- Wishlist page, working cart drawer with totals and free-shipping progress
- SEO service (titles, meta, canonical, structured data), skip link, focus states, ARIA on all
  dialogs and radiogroups

**Next milestones:** full cart page → multi-step checkout → authentication → Laravel API →
admin dashboard. `/cart`, `/checkout`, `/account` and `/admin` currently render an on-brand holding
page rather than a blank screen.

---

## 9. Imagery

Every image URL in the app resolves through `core/config/media.config.ts`. Nothing is hardcoded in
a component.

The bundled files in `public/media` are **tonal garment studies, not photography** — deliberately
minimal placeholders in the brand palette so layout, weight and rhythm can be judged before the
shoot. To swap in real imagery:

- **Same filenames** — drop production shots into `public/media` using the existing keys
  (`{slug}-1.jpg`, `{slug}-2.jpg`, `hero.jpg`, `editorial-men.jpg`, …). Nothing else changes.
- **A CDN or Unsplash** — set `MEDIA_SOURCE` to `'unsplash'` or `'cdn'` in `media.config.ts` and
  fill in the id map / root. `ImageFallbackDirective` falls back to the bundled study if a remote
  image fails, so a bad URL never leaves a hole in the grid.

---

## 10. Performance and accessibility notes

- Every route is lazy-loaded; the homepage bundle is ~5 kB gzipped on top of the shell
- Below-the-fold images use `loading="lazy"`; the hero and first product row are eager with
  `fetchpriority="high"`
- `@for` blocks track by stable ids; `OnPush` on every component; no manual subscriptions outside
  `takeUntilDestroyed` / `toSignal`
- Semantic landmarks, skip link, visible focus ring, `aria-modal` dialogs with Escape handling,
  radiogroup semantics on colour and size, live regions for toasts and quantity
