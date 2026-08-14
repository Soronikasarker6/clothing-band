/** Editorial copy for the homepage. Kept out of templates so it can move to a CMS. */

export const HERO = {
  eyebrow: 'Autumn / Winter 2026',
  titleLines: ['New Season', 'Essentials'],
  body: 'Designed for everyday confidence — considered cuts, honest fabrics and a palette that stays quiet.',
  primary: { label: 'Shop Women', path: '/women' },
  secondary: { label: 'Shop Men', path: '/men' },
  mediaKey: 'hero',
  mobileMediaKey: 'hero-mobile',
} as const;

export interface EditorialPanel {
  readonly eyebrow: string;
  readonly title: string;
  readonly quote: string;
  readonly ctaLabel: string;
  readonly ctaPath: string;
  readonly mediaKey: string;
}

export const MEN_PANEL: EditorialPanel = {
  eyebrow: 'For him',
  title: "Men's Collection",
  quote: 'Everyday essentials. Elevated.',
  ctaLabel: 'Shop Men',
  ctaPath: '/men',
  mediaKey: 'editorial-men',
};

export const WOMEN_PANEL: EditorialPanel = {
  eyebrow: 'For her',
  title: "Women's Collection",
  quote: 'Effortless pieces for every mood.',
  ctaLabel: 'Shop Women',
  ctaPath: '/women',
  mediaKey: 'editorial-women',
};

export const CAMPAIGN = {
  eyebrow: 'Featured collection',
  title: 'The Autumn Edit',
  body: 'Timeless layers designed for the season — wool, brushed cotton and denim in a warm, grounded palette.',
  ctaLabel: 'Explore the edit',
  ctaPath: '/collections/autumn-edit',
  mediaKey: 'campaign-autumn',
} as const;

export const BRAND_STORY = {
  eyebrow: 'Our approach',
  title: 'Designed with intention.',
  body: 'We make a small number of pieces and we make them properly. Every garment starts with the fabric, is cut for how it will actually be worn, and is produced by partners we have worked with for years.',
  mediaKey: 'brand-story',
  ctaLabel: 'Read our story',
  ctaPath: '/about',
  pillars: [
    { title: 'Quality', body: 'Mills chosen for the hand of the cloth, not the price of it.' },
    { title: 'Comfort', body: 'Fits tested on real bodies across a full week of wear.' },
    { title: 'Modern design', body: 'Clean lines that hold up long after the season closes.' },
    { title: 'Responsible production', body: 'Audited partners, traceable fibres, no overproduction.' },
  ],
} as const;

export const NEWSLETTER = {
  title: 'Stay in the loop.',
  body: 'Get early access to new collections, exclusive releases and private offers.',
} as const;
