import type { ColorOption, Gender, SizeCode } from '../models/catalog.model';

export interface NavColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export interface NavLink {
  readonly label: string;
  readonly path: string;
}

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly gender?: Gender;
  readonly columns?: readonly NavColumn[];
  readonly featured?: { readonly eyebrow: string; readonly title: string; readonly mediaKey: string; readonly path: string };
}

export const BRAND = {
  name: 'Maison Atelier',
  shortName: 'MAISON',
  tagline: 'Considered clothing for a considered life.',
  established: '2014',
  city: 'Copenhagen',
} as const;

export const SIZES: readonly SizeCode[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const COLORS: readonly ColorOption[] = [
  { id: 'ivory', name: 'Ivory', swatch: '#f3efe7', needsBorder: true },
  { id: 'bone', name: 'Bone', swatch: '#e5ded1', needsBorder: true },
  { id: 'ecru', name: 'Ecru', swatch: '#ded5c4', needsBorder: true },
  { id: 'cream', name: 'Cream', swatch: '#ede6d8', needsBorder: true },
  { id: 'sand', name: 'Sand', swatch: '#c8b79a' },
  { id: 'camel', name: 'Camel', swatch: '#b08d5f' },
  { id: 'clay', name: 'Clay', swatch: '#a0644b' },
  { id: 'stone', name: 'Stone', swatch: '#8c887e' },
  { id: 'slate', name: 'Slate', swatch: '#4a5259' },
  { id: 'olive', name: 'Olive', swatch: '#5a5f4a' },
  { id: 'indigo', name: 'Indigo', swatch: '#2c3348' },
  { id: 'charcoal', name: 'Charcoal', swatch: '#2f2f2c' },
  { id: 'ink', name: 'Ink', swatch: '#1a1a18' },
  { id: 'black', name: 'Black', swatch: '#101010' },
];

export const COLOR_MAP: ReadonlyMap<string, ColorOption> = new Map(COLORS.map((c) => [c.id, c]));

export const MEN_CATEGORIES: readonly NavLink[] = [
  { label: 'T-Shirts', path: '/men/t-shirts' },
  { label: 'Shirts', path: '/men/shirts' },
  { label: 'Pants', path: '/men/pants' },
  { label: 'Jeans', path: '/men/jeans' },
  { label: 'Hoodies', path: '/men/hoodies' },
  { label: 'Jackets', path: '/men/jackets' },
  { label: 'Casual Wear', path: '/men/casual-wear' },
];

export const WOMEN_CATEGORIES: readonly NavLink[] = [
  { label: 'T-Shirts', path: '/women/t-shirts' },
  { label: 'Tops', path: '/women/tops' },
  { label: 'Shirts', path: '/women/shirts' },
  { label: 'Pants', path: '/women/pants' },
  { label: 'Jeans', path: '/women/jeans' },
  { label: 'Dresses', path: '/women/dresses' },
  { label: 'Skirts', path: '/women/skirts' },
  { label: 'Jackets', path: '/women/jackets' },
  { label: 'Casual Wear', path: '/women/casual-wear' },
];

export const PRIMARY_NAV: readonly NavItem[] = [
  {
    label: 'Women',
    path: '/women',
    gender: 'women',
    columns: [
      { title: 'Categories', links: WOMEN_CATEGORIES },
      {
        title: 'Collections',
        links: [
          { label: 'New Arrivals', path: '/new-arrivals' },
          { label: 'The Autumn Edit', path: '/collections/autumn-edit' },
          { label: 'Everyday Essentials', path: '/collections/essentials' },
          { label: 'Sale', path: '/sale' },
        ],
      },
    ],
    featured: {
      eyebrow: 'Featured',
      title: "Women's Collection",
      mediaKey: 'editorial-women',
      path: '/women',
    },
  },
  {
    label: 'Men',
    path: '/men',
    gender: 'men',
    columns: [
      { title: 'Categories', links: MEN_CATEGORIES },
      {
        title: 'Collections',
        links: [
          { label: 'New Arrivals', path: '/new-arrivals' },
          { label: 'The Autumn Edit', path: '/collections/autumn-edit' },
          { label: 'Everyday Essentials', path: '/collections/essentials' },
          { label: 'Sale', path: '/sale' },
        ],
      },
    ],
    featured: {
      eyebrow: 'Featured',
      title: "Men's Collection",
      mediaKey: 'editorial-men',
      path: '/men',
    },
  },
  { label: 'New Arrivals', path: '/new-arrivals' },
  { label: 'Collections', path: '/collections' },
  { label: 'Sale', path: '/sale' },
];

export const FOOTER_COLUMNS: readonly NavColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Women', path: '/women' },
      { label: 'Men', path: '/men' },
      { label: 'New Arrivals', path: '/new-arrivals' },
      { label: 'Collections', path: '/collections' },
      { label: 'Sale', path: '/sale' },
    ],
  },
  {
    title: 'Client Care',
    links: [
      { label: 'Shipping', path: '/help/shipping' },
      { label: 'Returns & Exchanges', path: '/help/returns' },
      { label: 'Size Guide', path: '/help/size-guide' },
      { label: 'Garment Care', path: '/help/care' },
      { label: 'Contact', path: '/help/contact' },
    ],
  },
  {
    title: 'Maison',
    links: [
      { label: 'Our Story', path: '/about' },
      { label: 'Responsibility', path: '/about/responsibility' },
      { label: 'Materials', path: '/about/materials' },
      { label: 'Stores', path: '/stores' },
      { label: 'Careers', path: '/careers' },
    ],
  },
];

export const POPULAR_SEARCHES: readonly string[] = [
  'Linen shirt',
  'Wide trouser',
  'Straight jean',
  'Wool blazer',
  'Midi dress',
  'Cotton tee',
];
