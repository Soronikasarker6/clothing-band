# Laravel REST API contract

Base URL comes from `environment.apiBaseUrl`. All responses are JSON, serialised through API
Resources. Authentication uses Laravel Sanctum bearer tokens; `apiInterceptor` attaches the token
and handles 401 / 5xx globally.

---

## Conventions

- Products are addressed by **slug** in public routes and by **id** in admin routes.
- List endpoints return `{ items, total, page, perPage, totalPages }`.
- Errors follow Laravel's default shape: `422 { message, errors: { field: [..] } }`.
- Money is returned as a number in the minor-unit-free form the storefront formats (e.g. `185`).

---

## Catalogue

### `GET /api/products`

| Query param | Type | Notes |
| --- | --- | --- |
| `gender` | `men \| women \| unisex` | |
| `category` | slug | Combined with `gender` to disambiguate |
| `sizes` | CSV of `XS…XXL` | Matches any |
| `colors` | CSV of colour ids | Matches any |
| `min_price`, `max_price` | number | Applied to the effective (sale) price |
| `in_stock` | bool | Excludes products with zero variant stock |
| `search` | string | Name, description, category, colour |
| `sort` | `featured \| newest \| price-asc \| price-desc \| rating` | Default `featured` |
| `page`, `per_page` | int | Default `1`, `12` |

```jsonc
{
  "items": [
    {
      "id": 21,
      "name": "Tailored Wool Blazer",
      "slug": "tailored-wool-blazer",
      "categorySlug": "jackets",
      "categoryName": "Jackets",
      "gender": "women",
      "description": "A single-breasted blazer …",
      "price": 345,
      "salePrice": null,
      "sku": "MA-W022",
      "currency": "USD",
      "rating": 4.9,
      "reviewCount": 112,
      "images": [{ "url": "/media/tailored-wool-blazer-1.jpg", "alt": "…", "colorId": "charcoal" }],
      "colors": [{ "id": "charcoal", "name": "Charcoal", "swatch": "#2f2f2c" }],
      "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
      "variants": [{ "id": 511, "size": "M", "colorId": "charcoal", "stock": 6 }],
      "stock": 41,
      "featured": true,
      "isNew": false,
      "trending": true,
      "details": {
        "material": "100% virgin wool, cupro lining",
        "fit": "Regular fit.",
        "care": ["Professional dry clean only", "…"],
        "shipping": "Complimentary shipping on orders over $150 …",
        "returns": "Free returns within 30 days …"
      }
    }
  ],
  "total": 24, "page": 1, "perPage": 12, "totalPages": 2
}
```

### `GET /api/products/{slug}`

Single `Product` object, same shape as a list item.

### `GET /api/products/suggest?q=&limit=`

Array of lightweight `Product` objects for the search overlay typeahead.

### `GET /api/categories?gender=`

```jsonc
[{ "id": 13, "name": "Dresses", "slug": "dresses", "gender": "women",
   "description": "Bias cuts and knitted columns …", "image": "/media/cat-women-dresses.jpg" }]
```

### `GET /api/categories/{slug}?gender=`

Single `Category`.

---

## Admin catalogue (`auth:sanctum` + `can:admin`)

| Method | Route | Body |
| --- | --- | --- |
| `POST` | `/api/products` | `StoreProductRequest` |
| `PUT` | `/api/products/{id}` | `UpdateProductRequest` |
| `DELETE` | `/api/products/{id}` | — |
| `POST` | `/api/products/{id}/images` | multipart `image[]` |
| `PUT` | `/api/products/{id}/variants` | `[{ size, colorId, stock }]` (full replace) |
| `POST/PUT/DELETE` | `/api/categories[/{id}]` | `CategoryRequest` |

`StoreProductRequest` fields: `name`, `description`, `category_id`, `gender`, `price`,
`sale_price?`, `sku`, `sizes[]`, `colors[]`, `variants[]`, `featured`, `is_new`, `images[]`.

---

## Orders

| Method | Route | Notes |
| --- | --- | --- |
| `GET` | `/api/orders` | Authenticated user's orders, newest first |
| `POST` | `/api/orders` | Places an order from the posted lines |
| `GET` | `/api/orders/{reference}` | Single order; 403 if not the owner |
| `GET` | `/api/admin/orders` | All orders, filterable by `status`, `customer` |
| `PATCH` | `/api/admin/orders/{id}/status` | `{ "status": "shipped" }` |

`POST /api/orders` request:

```jsonc
{
  "items": [{ "productId": 21, "variantId": 511, "quantity": 1 }],
  "shippingAddress": {
    "fullName": "…", "email": "…", "phone": "…",
    "addressLine": "…", "city": "…", "country": "…", "postalCode": "…"
  },
  "billingAddressSameAsShipping": true,
  "couponCode": "ATELIER10",
  "paymentMethod": "card"
}
```

`OrderService::place()` re-prices server-side from the database, validates and decrements variant
stock inside a transaction, applies the coupon, and returns the persisted order. Client-supplied
prices are never trusted.

Response:

```jsonc
{
  "id": 1042, "reference": "MA-2026-001042", "placedAt": "2026-08-14T10:12:00Z",
  "status": "pending",
  "items": [{ "productId": 21, "name": "Tailored Wool Blazer", "image": "…",
              "quantity": 1, "price": 345, "size": "M", "colorName": "Charcoal" }],
  "subtotal": 345, "shipping": 0, "discount": 34.5, "total": 310.5
}
```

Statuses: `pending → processing → shipped → delivered`, plus `cancelled`.

---

## Wishlist

| Method | Route | Body |
| --- | --- | --- |
| `GET` | `/api/wishlist` | — |
| `POST` | `/api/wishlist` | `{ "productId": 21 }` |
| `DELETE` | `/api/wishlist/{productId}` | — |

Guests keep the wishlist in `localStorage`; on sign-in the client posts the local ids once to
merge them server-side.

---

## Authentication

| Method | Route | Body |
| --- | --- | --- |
| `POST` | `/api/auth/register` | `{ name, email, password, password_confirmation }` |
| `POST` | `/api/auth/login` | `{ email, password }` → `{ user, token }` |
| `POST` | `/api/auth/logout` | — |
| `GET` | `/api/auth/me` | → `User` |
| `PUT` | `/api/account/profile` | `{ name, email, phone }` |
| `GET/POST/PUT/DELETE` | `/api/account/addresses[/{id}]` | Address book |

---

## Admin dashboard

`GET /api/admin/metrics`

```jsonc
{
  "totalSales": 184320.5,
  "orderCount": 612,
  "customerCount": 388,
  "productCount": 24,
  "lowStock": [{ "productId": 12, "name": "Suede Bomber Jacket", "size": "M",
                 "colorName": "Clay", "stock": 2 }],
  "recentOrders": [ /* Order objects, limit 10 */ ]
}
```

`GET /api/admin/customers?search=&page=` returns customers with `orderCount` and `lifetimeValue`.

---

## Miscellaneous

| Method | Route | Notes |
| --- | --- | --- |
| `POST` | `/api/newsletter` | `{ email }` |
| `POST` | `/api/coupons/validate` | `{ code, subtotal }` → `{ valid, rate, discount }` |
