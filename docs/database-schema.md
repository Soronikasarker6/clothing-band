# Database schema (MySQL / Laravel migrations)

The brief's minimum structure with three normalisations applied, each noted below.

---

## Entity relationships

```
users ──< addresses
users ──< orders ──< order_items
users ──< wishlists >── products
users ──< carts ──< cart_items >── product_variants

categories ──< products ──< product_images
                        └──< product_variants
coupons ──< orders
```

---

## Tables

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | bigint PK | |
| `name` | varchar(120) | |
| `email` | varchar(180) | unique |
| `password` | varchar(255) | hashed |
| `role` | enum(`customer`,`admin`) | default `customer` |
| `phone` | varchar(40) nullable | |
| `email_verified_at`, `remember_token`, `timestamps` | | |

### `addresses`

`id`, `user_id` FK→users cascade, `label`, `full_name`, `phone`, `address_line`, `city`,
`country` (ISO-2), `postal_code`, `is_default` bool, `timestamps`.

> **Normalisation 1.** Addresses are their own table rather than columns on `orders`, so a
> customer keeps an address book and orders reference a snapshot.

### `categories`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | bigint PK | |
| `name` | varchar(80) | |
| `slug` | varchar(80) | |
| `gender` | enum(`men`,`women`,`unisex`) | |
| `description` | text nullable | |
| `image` | varchar(255) nullable | |
| `sort_order` | smallint default 0 | |

`unique(slug, gender)` — `t-shirts` exists for both genders as distinct rows.

### `products`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | bigint PK | |
| `category_id` | FK→categories restrict | |
| `name` | varchar(160) | |
| `slug` | varchar(180) unique | |
| `description` | text | |
| `price` | decimal(10,2) | |
| `sale_price` | decimal(10,2) nullable | `< price` enforced in the FormRequest |
| `sku` | varchar(40) unique | |
| `gender` | enum(`men`,`women`,`unisex`) | denormalised from category for fast filtering |
| `material`, `fit`, `care`(json), `shipping_note`, `returns_note` | | product detail panel |
| `rating` | decimal(2,1) default 0 | maintained from reviews |
| `review_count` | int default 0 | |
| `featured`, `is_new`, `trending` | bool | |
| `published_at` | timestamp nullable | drafts are unpublished |
| `timestamps`, `softDeletes` | | |

Indexes: `(gender, category_id)`, `(featured)`, `(is_new)`, `fulltext(name, description)`.

> **Normalisation 2.** There is no `stock` column. Product stock is `SUM(product_variants.stock)`,
> exposed as an appended attribute. A single number cannot express size × colour availability, and
> keeping both invites drift.

### `product_images`

`id`, `product_id` FK cascade, `path`, `alt`, `color_id` varchar(40) nullable, `sort_order`.
`color_id` lets the gallery follow the selected colour.

### `product_variants`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | bigint PK | |
| `product_id` | FK cascade | |
| `size` | enum(`XS`,`S`,`M`,`L`,`XL`,`XXL`) | |
| `color_id` | varchar(40) | matches `COLORS` in `site.config.ts` |
| `color_name` | varchar(40) | |
| `swatch` | varchar(9) | hex |
| `stock` | int unsigned default 0 | |
| `price_delta` | decimal(10,2) default 0 | for variant-specific pricing later |

`unique(product_id, size, color_id)`.

### `carts` / `cart_items`

`carts`: `id`, `user_id` nullable FK, `session_token` varchar(64) nullable, `timestamps`.
`cart_items`: `id`, `cart_id` FK cascade, `product_variant_id` FK restrict, `quantity`,
`unique(cart_id, product_variant_id)`.

Guest carts live in `localStorage` and are merged into the row-backed cart on sign-in.

### `orders`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | bigint PK | |
| `reference` | varchar(24) unique | e.g. `MA-2026-001042` |
| `user_id` | FK→users nullable, null on delete | guest checkout allowed |
| `status` | enum(`pending`,`processing`,`shipped`,`delivered`,`cancelled`) | |
| `subtotal`, `shipping`, `discount`, `total` | decimal(10,2) | |
| `coupon_id` | FK→coupons nullable | |
| `shipping_address` | json | snapshot |
| `billing_address` | json | snapshot |
| `payment_method` | varchar(40) | |
| `payment_reference` | varchar(120) nullable | gateway id |
| `placed_at` | timestamp | |
| `timestamps` | | |

Indexes: `(user_id, placed_at)`, `(status)`.

### `order_items`

`id`, `order_id` FK cascade, `product_id` FK nullable (null on delete),
`product_variant_id` FK nullable, `name`, `image`, `size`, `color_name`, `quantity`,
`price` decimal(10,2).

> **Normalisation 3.** Every display field is snapshotted. An order placed at $345 must still read
> $345 after the product is repriced, renamed or removed.

### `wishlists`

`id`, `user_id` FK cascade, `product_id` FK cascade, `created_at`,
`unique(user_id, product_id)`.

### `coupons`

`id`, `code` unique, `type` enum(`percent`,`fixed`), `value` decimal(10,2),
`min_subtotal` decimal(10,2) nullable, `starts_at`, `ends_at`, `usage_limit`, `used_count`,
`active` bool.

---

## Seeders

| Seeder | Contents |
| --- | --- |
| `CategorySeeder` | 16 categories — 7 men, 9 women |
| `ProductSeeder` | The 24 products in `core/config/catalog.data.ts`, with images and variants |
| `UserSeeder` | One admin, a handful of customers |
| `OrderSeeder` | Sample orders across every status, for the admin dashboard |
| `CouponSeeder` | `ATELIER10` (10%), `WELCOME15` (15%) — matching the frontend mock |

Keeping the seeder aligned with `catalog.data.ts` means the app looks identical whether
`environment.useMockData` is on or off — which makes the cutover to the API a one-line change.
