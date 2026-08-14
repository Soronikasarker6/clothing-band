import type {
  Category,
  ColorOption,
  Gender,
  Product,
  ProductDetails,
  ProductImage,
  ProductVariant,
  SizeCode,
} from '../models/catalog.model';
import { COLOR_MAP, SIZES } from './site.config';
import { media } from './media.config';

/**
 * Development catalogue.
 *
 * This is the single place mock product data lives — no component ever declares
 * a product inline. `ProductService` reads from here while
 * `environment.useMockData` is true and from the Laravel API once it is false,
 * so the shape below is deliberately identical to the API resource payload.
 */

interface CategorySeed {
  readonly slug: string;
  readonly name: string;
  readonly gender: Gender;
  readonly description: string;
  readonly mediaKey?: string;
}

const CATEGORY_SEEDS: readonly CategorySeed[] = [
  { slug: 't-shirts', name: 'T-Shirts', gender: 'men', description: 'Weighted cottons cut for a clean, easy line.', mediaKey: 'cat-men-tshirts' },
  { slug: 'shirts', name: 'Shirts', gender: 'men', description: 'Oxford, poplin and washed linen in relaxed proportions.', mediaKey: 'cat-men-shirts' },
  { slug: 'pants', name: 'Pants', gender: 'men', description: 'Tailored trousers and soft chinos for every day.' },
  { slug: 'jeans', name: 'Jeans', gender: 'men', description: 'Japanese selvedge and washed denim, straight through the leg.', mediaKey: 'cat-men-jeans' },
  { slug: 'hoodies', name: 'Hoodies', gender: 'men', description: 'Brushed loopback in quiet, wearable tones.' },
  { slug: 'jackets', name: 'Jackets', gender: 'men', description: 'Outerwear built to last past the season.', mediaKey: 'cat-men-outerwear' },
  { slug: 'casual-wear', name: 'Casual Wear', gender: 'men', description: 'The pieces that carry the rest of the wardrobe.' },
  { slug: 't-shirts', name: 'T-Shirts', gender: 'women', description: 'Fine ribs and soft jersey with a considered fit.' },
  { slug: 'tops', name: 'Tops', gender: 'women', description: 'Draped silks and light knits for layering.', mediaKey: 'cat-women-tops' },
  { slug: 'shirts', name: 'Shirts', gender: 'women', description: 'Crisp poplin, generously cut.' },
  { slug: 'pants', name: 'Pants', gender: 'women', description: 'High-rise tailoring with a long, clean drape.' },
  { slug: 'jeans', name: 'Jeans', gender: 'women', description: 'Rigid and washed denim in straight silhouettes.', mediaKey: 'cat-women-jeans' },
  { slug: 'dresses', name: 'Dresses', gender: 'women', description: 'Bias cuts and knitted columns for day into evening.', mediaKey: 'cat-women-dresses' },
  { slug: 'skirts', name: 'Skirts', gender: 'women', description: 'Pleats and panels that move quietly.', mediaKey: 'cat-women-skirts' },
  { slug: 'jackets', name: 'Jackets', gender: 'women', description: 'Sharp shoulders, soft finishes.' },
  { slug: 'casual-wear', name: 'Casual Wear', gender: 'women', description: 'Easy pieces made for repetition.' },
];

export const CATEGORIES: readonly Category[] = CATEGORY_SEEDS.map((seed, index) => ({
  id: index + 1,
  name: seed.name,
  slug: seed.slug,
  gender: seed.gender,
  description: seed.description,
  image: seed.mediaKey ? media(seed.mediaKey, { width: 900, ratio: '3:4' }) : undefined,
}));

export function categoryKey(gender: Gender, slug: string): string {
  return `${gender}/${slug}`;
}

interface ProductSeed {
  readonly slug: string;
  readonly name: string;
  readonly gender: Exclude<Gender, 'unisex'>;
  readonly category: string;
  readonly price: number;
  readonly salePrice?: number;
  readonly colors: readonly [string, string];
  readonly description: string;
  readonly material: string;
  readonly fit: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly sizes?: readonly SizeCode[];
  readonly featured?: boolean;
  readonly isNew?: boolean;
  readonly trending?: boolean;
  readonly lowStock?: boolean;
}

const PRODUCT_SEEDS: readonly ProductSeed[] = [
  {
    slug: 'essential-cotton-tee', name: 'Essential Cotton Tee', gender: 'men', category: 't-shirts',
    price: 48, colors: ['ivory', 'charcoal'], rating: 4.8, reviewCount: 214, isNew: true, trending: true,
    description: 'A mid-weight jersey tee with a clean shoulder and a straight body. The one you reach for first.',
    material: '100% organic long-staple cotton, 200 gsm', fit: 'Regular fit. Model is 186cm and wears M.',
  },
  {
    slug: 'heavyweight-boxy-tee', name: 'Heavyweight Boxy Tee', gender: 'men', category: 't-shirts',
    price: 62, colors: ['charcoal', 'bone'], rating: 4.6, reviewCount: 98, isNew: true,
    description: 'Garment-dyed and pre-shrunk, with a squared body that holds its shape wash after wash.',
    material: '100% organic cotton, 260 gsm', fit: 'Boxy fit. Size down for a closer line.',
  },
  {
    slug: 'oxford-relaxed-shirt', name: 'Relaxed Oxford Shirt', gender: 'men', category: 'shirts',
    price: 128, colors: ['ivory', 'slate'], rating: 4.9, reviewCount: 176, featured: true, trending: true,
    description: 'Woven on slow looms for a softer hand, with a considered collar roll and a relaxed body.',
    material: '100% cotton oxford, 140 gsm', fit: 'Relaxed fit through the chest and sleeve.',
  },
  {
    slug: 'linen-camp-shirt', name: 'Linen Camp Shirt', gender: 'men', category: 'shirts',
    price: 145, salePrice: 110, colors: ['sand', 'cream'], rating: 4.5, reviewCount: 64,
    description: 'An open camp collar in washed European linen. Cut wide, finished with a curved hem.',
    material: '100% washed French linen', fit: 'Loose fit. Take your usual size.',
  },
  {
    slug: 'pleated-wool-trouser', name: 'Pleated Wool Trouser', gender: 'men', category: 'pants',
    price: 195, colors: ['charcoal', 'stone'], rating: 4.7, reviewCount: 132, featured: true,
    description: 'A single forward pleat, a high rise and a leg that falls straight to the shoe.',
    material: '98% virgin wool, 2% elastane', fit: 'Straight leg with a high rise.',
  },
  {
    slug: 'tapered-cotton-chino', name: 'Tapered Cotton Chino', gender: 'men', category: 'pants',
    price: 135, colors: ['sand', 'olive'], rating: 4.4, reviewCount: 88,
    description: 'Peached cotton twill with a gentle taper below the knee and a clean, flat front.',
    material: '97% cotton twill, 3% elastane', fit: 'Tapered fit, mid rise.',
  },
  {
    slug: 'selvedge-straight-jean', name: 'Selvedge Straight Jean', gender: 'men', category: 'jeans',
    price: 185, colors: ['indigo', 'slate'], rating: 4.9, reviewCount: 241, featured: true, trending: true,
    description: 'Rigid Japanese selvedge denim that fades to your own pattern of wear over time.',
    material: '100% cotton, 13.5oz Japanese selvedge', fit: 'Straight leg, mid rise. Rigid — expect a break-in.',
  },
  {
    slug: 'washed-relaxed-jean', name: 'Washed Relaxed Jean', gender: 'men', category: 'jeans',
    price: 160, salePrice: 128, colors: ['slate', 'stone'], rating: 4.3, reviewCount: 76,
    description: 'A softer, stone-washed denim with room through the thigh and a full straight leg.',
    material: '100% cotton, 12oz washed denim', fit: 'Relaxed fit, mid rise.',
  },
  {
    slug: 'brushed-fleece-hoodie', name: 'Brushed Fleece Hoodie', gender: 'men', category: 'hoodies',
    price: 155, colors: ['ecru', 'charcoal'], rating: 4.8, reviewCount: 189, trending: true,
    description: 'Heavy loopback brushed on the inside, with a lined hood and a set-in shoulder.',
    material: '100% cotton loopback, 420 gsm', fit: 'Regular fit with a dropped shoulder.',
  },
  {
    slug: 'zip-through-hoodie', name: 'Zip-Through Hoodie', gender: 'men', category: 'hoodies',
    price: 168, colors: ['olive', 'black'], rating: 4.5, reviewCount: 54, isNew: true, lowStock: true,
    description: 'A full-zip in dry-handle cotton, with a two-panel hood and matte hardware.',
    material: '100% cotton, 380 gsm', fit: 'Regular fit.',
  },
  {
    slug: 'wool-blend-overshirt', name: 'Wool-Blend Overshirt', gender: 'men', category: 'jackets',
    price: 285, colors: ['charcoal', 'camel'], rating: 4.8, reviewCount: 121, featured: true,
    description: 'A shirt-jacket in brushed wool that layers over knitwear without bulk.',
    material: '70% wool, 30% recycled polyamide', fit: 'Regular fit. Layer over a mid-weight knit.',
  },
  {
    slug: 'suede-bomber-jacket', name: 'Suede Bomber Jacket', gender: 'men', category: 'jackets',
    price: 495, colors: ['clay', 'ink'], rating: 5, reviewCount: 42, isNew: true, lowStock: true,
    description: 'Butter-soft goat suede with a ribbed collar and a slightly cropped body.',
    material: '100% goat suede, viscose lining', fit: 'Regular fit, cropped body.',
  },
  {
    slug: 'merino-crew-knit', name: 'Merino Crew Knit', gender: 'men', category: 'casual-wear',
    price: 175, colors: ['camel', 'ecru'], rating: 4.7, reviewCount: 93,
    description: 'A fine-gauge merino crew with a ribbed neckline that keeps its shape.',
    material: '100% extra-fine merino wool', fit: 'Regular fit.',
  },
  {
    slug: 'fine-rib-tee', name: 'Fine Rib Tee', gender: 'women', category: 't-shirts',
    price: 52, colors: ['ivory', 'black'], rating: 4.7, reviewCount: 158, isNew: true, trending: true,
    description: 'A close fine-rib with a high neckline and a body that skims rather than clings.',
    material: '92% organic cotton, 8% elastane', fit: 'Slim fit. Size up for a softer line.',
  },
  {
    slug: 'draped-silk-top', name: 'Draped Silk Top', gender: 'women', category: 'tops',
    price: 165, colors: ['ecru', 'stone'], rating: 4.6, reviewCount: 71, featured: true,
    description: 'Sandwashed silk cut on the bias so it falls softly from the shoulder.',
    material: '100% sandwashed mulberry silk', fit: 'Relaxed fit.',
  },
  {
    slug: 'poplin-oversized-shirt', name: 'Oversized Poplin Shirt', gender: 'women', category: 'shirts',
    price: 138, colors: ['ivory', 'sand'], rating: 4.8, reviewCount: 204, trending: true,
    description: 'Crisp cotton poplin with a dropped shoulder, a long placket and a curved hem.',
    material: '100% cotton poplin', fit: 'Oversized fit.',
  },
  {
    slug: 'high-rise-wide-trouser', name: 'High-Rise Wide Trouser', gender: 'women', category: 'pants',
    price: 178, colors: ['black', 'cream'], rating: 4.9, reviewCount: 167, featured: true,
    description: 'A fluid wide leg with a defined waistband and a clean, uninterrupted front.',
    material: '65% viscose, 35% virgin wool', fit: 'Wide leg, high rise.',
  },
  {
    slug: 'straight-leg-jean', name: 'Straight-Leg Jean', gender: 'women', category: 'jeans',
    price: 168, colors: ['indigo', 'bone'], rating: 4.6, reviewCount: 139, trending: true,
    description: 'A rigid denim with a high waist and a straight, ankle-grazing leg.',
    material: '100% cotton, 12oz denim', fit: 'Straight leg, high rise.',
  },
  {
    slug: 'bias-cut-midi-dress', name: 'Bias-Cut Midi Dress', gender: 'women', category: 'dresses',
    price: 245, colors: ['stone', 'ivory'], rating: 4.9, reviewCount: 88, featured: true, isNew: true,
    description: 'Cut on the bias so it moves with you, finished with a fine bound neckline.',
    material: '100% cupro', fit: 'Regular fit. Falls below the calf.',
  },
  {
    slug: 'knit-column-dress', name: 'Knit Column Dress', gender: 'women', category: 'dresses',
    price: 265, salePrice: 199, colors: ['charcoal', 'camel'], rating: 4.5, reviewCount: 62,
    description: 'A dense rib knit that holds a long column line from shoulder to hem.',
    material: '80% viscose, 20% polyamide', fit: 'Slim fit.',
  },
  {
    slug: 'pleated-midi-skirt', name: 'Pleated Midi Skirt', gender: 'women', category: 'skirts',
    price: 185, colors: ['sand', 'charcoal'], rating: 4.7, reviewCount: 74, isNew: true,
    description: 'Knife pleats pressed into a light twill, set on a flat waistband.',
    material: '100% recycled polyester twill', fit: 'A-line, high rise.',
  },
  {
    slug: 'tailored-wool-blazer', name: 'Tailored Wool Blazer', gender: 'women', category: 'jackets',
    price: 345, colors: ['charcoal', 'ecru'], rating: 4.9, reviewCount: 112, featured: true, trending: true,
    description: 'A single-breasted blazer with a soft shoulder and a lightly suppressed waist.',
    material: '100% virgin wool, cupro lining', fit: 'Regular fit.',
  },
  {
    slug: 'quilted-liner-jacket', name: 'Quilted Liner Jacket', gender: 'women', category: 'jackets',
    price: 275, colors: ['olive', 'ink'], rating: 4.4, reviewCount: 47, lowStock: true,
    description: 'A light diamond-quilted liner that works alone or under a heavier coat.',
    material: 'Recycled polyamide shell, recycled fill', fit: 'Regular fit.',
  },
  {
    slug: 'cropped-cotton-top', name: 'Cropped Cotton Top', gender: 'women', category: 'casual-wear',
    price: 88, colors: ['cream', 'clay'], rating: 4.3, reviewCount: 39, isNew: true,
    description: 'A short, sleeveless shell in compact cotton with a clean bound armhole.',
    material: '100% compact cotton', fit: 'Regular fit, cropped length.',
  },
];

const CARE_BY_CATEGORY: Readonly<Record<string, readonly string[]>> = {
  't-shirts': ['Machine wash cold with like colours', 'Do not bleach', 'Tumble dry low', 'Warm iron if needed'],
  tops: ['Hand wash cold or dry clean', 'Do not bleach', 'Dry flat in shade', 'Cool iron on reverse'],
  shirts: ['Machine wash cold', 'Do not bleach', 'Line dry', 'Warm iron while slightly damp'],
  pants: ['Dry clean recommended', 'Do not bleach', 'Steam to refresh', 'Cool iron on reverse'],
  jeans: ['Wash sparingly, cold, inside out', 'Do not bleach', 'Line dry', 'Expect indigo transfer at first'],
  hoodies: ['Machine wash cold, inside out', 'Do not bleach', 'Tumble dry low', 'Do not iron print areas'],
  jackets: ['Professional dry clean only', 'Do not bleach', 'Store on a broad hanger', 'Brush to refresh'],
  dresses: ['Dry clean recommended', 'Do not bleach', 'Dry flat in shade', 'Cool iron on reverse'],
  skirts: ['Machine wash cold on delicate', 'Do not bleach', 'Line dry', 'Cool iron between pleats'],
  'casual-wear': ['Machine wash cold', 'Do not bleach', 'Dry flat', 'Cool iron on reverse'],
};

const SHIPPING_COPY =
  'Complimentary shipping on orders over 15,000 tk. Standard delivery in 3–5 working days, express in 1–2.'
const RETURNS_COPY =
  'Free returns within 30 days, unworn and with tags attached. Exchanges are arranged from your account.';

function buildDetails(seed: ProductSeed): ProductDetails {
  return {
    material: seed.material,
    fit: seed.fit,
    care: CARE_BY_CATEGORY[seed.category] ?? CARE_BY_CATEGORY['t-shirts'],
    shipping: SHIPPING_COPY,
    returns: RETURNS_COPY,
  };
}

function buildImages(seed: ProductSeed): readonly ProductImage[] {
  return seed.colors.map((colorId, index) => ({
    url: media(`${seed.slug}-${index + 1}`, { width: 900, ratio: '3:4' }),
    alt: `${seed.name} in ${COLOR_MAP.get(colorId)?.name ?? colorId}`,
    colorId,
  }));
}

function buildVariants(seed: ProductSeed, startId: number, sizes: readonly SizeCode[]): readonly ProductVariant[] {
  const variants: ProductVariant[] = [];
  let id = startId;
  for (const colorId of seed.colors) {
    for (const size of sizes) {
      // Deterministic pseudo-stock so the UI can show sold-out and low-stock states.
      const seedValue = (seed.slug.length * 7 + size.length * 13 + colorId.length * 3) % 11;
      const base = seed.lowStock ? seedValue % 4 : seedValue;
      variants.push({ id: id++, size, colorId, stock: base });
    }
  }
  return variants;
}

function toColors(ids: readonly string[]): readonly ColorOption[] {
  return ids
    .map((id) => COLOR_MAP.get(id))
    .filter((c): c is ColorOption => Boolean(c));
}

let variantId = 1;

export const PRODUCTS: readonly Product[] = PRODUCT_SEEDS.map((seed, index) => {
  const sizes = seed.sizes ?? SIZES;
  const variants = buildVariants(seed, variantId, sizes);
  variantId += variants.length;
  const category = CATEGORIES.find((c) => c.slug === seed.category && c.gender === seed.gender);

  return {
    id: index + 1,
    name: seed.name,
    slug: seed.slug,
    categorySlug: seed.category,
    categoryName: category?.name ?? seed.category,
    gender: seed.gender,
    description: seed.description,
    price: seed.price,
    salePrice: seed.salePrice ?? null,
    sku: `MA-${seed.gender.slice(0, 1).toUpperCase()}${String(index + 1).padStart(3, '0')}`,
    currency: 'BDT',
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    images: buildImages(seed),
    colors: toColors(seed.colors),
    sizes,
    variants,
    stock: variants.reduce((total, v) => total + v.stock, 0),
    featured: seed.featured ?? false,
    isNew: seed.isNew ?? false,
    trending: seed.trending ?? false,
    details: buildDetails(seed),
  } satisfies Product;
});
