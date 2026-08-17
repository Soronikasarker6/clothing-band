/**
 * Centralised image configuration.
 *
 * Nothing in the application hardcodes an image URL — components ask for a media
 * key and this module decides where the file comes from. Swapping the placeholder
 * studies for production photography is a change to this one file.
 *
 *  - `local`    : the tonal garment studies bundled in `public/media`
 *  - `unsplash` : editorial photography served from the Unsplash CDN
 *
 * To move to a CDN or the Laravel storage disk, add a source branch to `media()`.
 */
export type MediaSource = 'local' | 'unsplash' | 'cdn';

export const MEDIA_SOURCE: MediaSource = 'unsplash';

/**
 * Root for bundled assets, resolved against the app's `<base href>` at runtime.
 *
 * A hardcoded `/media` only works when the app is served from the domain root. This
 * app is also deployed to GitHub Pages under a sub-path (`/clothing-band/`), where an
 * absolute `/media/...` request 404s against the domain root instead of hitting the
 * files actually deployed under the sub-path. Reading `<base href>` keeps this correct
 * in both places without hardcoding the repo name here.
 */
function localRoot(): string {
  const base = typeof document === 'undefined' ? '/' : (document.querySelector('base')?.getAttribute('href') ?? '/');
  return `${base.replace(/\/$/, '')}/media`;
}

/** Root for a future CDN / Laravel `storage/app/public` origin. */
const CDN_ROOT = '';

/**
 * Unsplash photo ids keyed by media key. Add an entry here and flip
 * `MEDIA_SOURCE` to `'unsplash'` to serve that asset from the CDN instead.
 * Anything without an entry transparently falls back to the bundled study.
 */
const UNSPLASH_IDS: Readonly<Record<string, string>> = {
  hero: 'photo-1490481651871-ab68de25d43d',
  'hero-mobile': 'photo-1483985988355-763728e1935b',
  'editorial-men': 'photo-1529139574466-a303027c1d8b',
  'editorial-women': 'photo-1539109136881-3be0616acf4b',
  'campaign-autumn': 'photo-1441986300917-64674bd600d8',
  'brand-story': 'photo-1523381210434-271e8be1f52b',

  // Category thumbnails
  'cat-men-tshirts': 'photo-1581655353564-df123a1eb820',
  'cat-men-shirts': 'photo-1602810316693-3667c854239a',
  'cat-men-jeans': 'photo-1714143136372-ddaf8b606da7',
  'cat-men-outerwear': 'photo-1675877879221-871aa9f7c314',
  'cat-women-tops': 'photo-1611235116156-0cbda6649efb',
  'cat-women-jeans': 'photo-1602293589930-45aad59ba3ab',
  'cat-women-dresses': 'photo-1616313253719-c46514cddee1',
  'cat-women-skirts': 'photo-1708363390847-b4af54f45273',

  // Men — tops
  'essential-cotton-tee-1': 'photo-1778671394516-8270eac13c42',
  'essential-cotton-tee-2': 'photo-1622562054284-b17d2bf63b7a',
  'heavyweight-boxy-tee-1': 'photo-1622519407650-3df9883f76a5',
  'heavyweight-boxy-tee-2': 'photo-1595188525947-4ba148279529',
  'oxford-relaxed-shirt-1': 'photo-1627686011747-74adda3d2343',
  'oxford-relaxed-shirt-2': 'photo-1732605559386-bc59426d1b16',
  'linen-camp-shirt-1': 'photo-1614809294682-6c6f4c12c15c',
  'linen-camp-shirt-2': 'photo-1772583435283-b07bc9950497',

  // Men — bottoms
  'pleated-wool-trouser-1': 'photo-1493357335960-4583bfa6f8d9',
  'pleated-wool-trouser-2': 'photo-1540704751673-44f9dfd188c0',
  'tapered-cotton-chino-1': 'photo-1639089277700-009681c5a9c9',
  'tapered-cotton-chino-2': 'photo-1712773663106-bcad3c446544',
  'selvedge-straight-jean-1': 'photo-1714143164072-7646ef5cb24d',
  'selvedge-straight-jean-2': 'photo-1598529253422-28d88fb922bf',
  'washed-relaxed-jean-1': 'photo-1774128089567-eeb0f6dbe3c4',
  'washed-relaxed-jean-2': 'photo-1602293589930-45aad59ba3ab',

  // Men — outerwear & knits
  'brushed-fleece-hoodie-1': 'photo-1589412649095-e1a7fa546081',
  'brushed-fleece-hoodie-2': 'photo-1611817757591-c3f345024273',
  'zip-through-hoodie-1': 'photo-1763618252006-cd7f54dc603b',
  'zip-through-hoodie-2': 'photo-1590103514500-5abdbbd4bf79',
  'wool-blend-overshirt-1': 'photo-1719418271955-79273259772d',
  'wool-blend-overshirt-2': 'photo-1680277830237-9f3c169df037',
  'suede-bomber-jacket-1': 'photo-1610904497231-78537234b552',
  'suede-bomber-jacket-2': 'photo-1602865891930-7df770e5fd99',
  'merino-crew-knit-1': 'photo-1612203035569-07e71ccffab0',
  'merino-crew-knit-2': 'photo-1630254688956-40da9f30216a',

  // Women — tops
  'fine-rib-tee-1': 'photo-1603305170378-e07dda860232',
  'fine-rib-tee-2': 'photo-1637010452808-9ce7cc6dc3b6',
  'draped-silk-top-1': 'photo-1601668460402-0e24a42fc238',
  'draped-silk-top-2': 'photo-1521327543073-3092c8f7c00a',
  'poplin-oversized-shirt-1': 'photo-1622445275992-e7efb32d2257',
  'poplin-oversized-shirt-2': 'photo-1717488703065-6968d2d143b9',
  'cropped-cotton-top-1': 'photo-1592595293637-8557fa6d3c64',
  'cropped-cotton-top-2': 'photo-1760551600405-54c70e6d7f42',

  // Women — bottoms
  'high-rise-wide-trouser-1': 'photo-1767631338127-8cd80ee2f9df',
  'high-rise-wide-trouser-2': 'photo-1621767527617-9f20f14c952c',
  'straight-leg-jean-1': 'photo-1598554747436-c9293d6a588f',
  'straight-leg-jean-2': 'photo-1758018230837-89188346c36f',
  'pleated-midi-skirt-1': 'photo-1593129747951-db31f82963da',
  'pleated-midi-skirt-2': 'photo-1603659752441-8b43d7f49f2c',

  // Women — dresses & outerwear
  'bias-cut-midi-dress-1': 'photo-1624278268402-5d627eb9476a',
  'bias-cut-midi-dress-2': 'photo-1631234764568-996fab371596',
  'knit-column-dress-1': 'photo-1554646450-63c20511569f',
  'knit-column-dress-2': 'photo-1618245056886-a7fce9bd79cf',
  'tailored-wool-blazer-1': 'photo-1715408153725-186c6c77fb45',
  'tailored-wool-blazer-2': 'photo-1571513722275-4b41940f54b8',
  'quilted-liner-jacket-1': 'photo-1707857041612-89f7d82efb38',
  'quilted-liner-jacket-2': 'photo-1717674796293-0a49f3721880',
};

export interface MediaOptions {
  /** Intrinsic width to request from the remote source. */
  readonly width?: number;
  /** Aspect crop hint for the remote source. */
  readonly ratio?: '3:4' | '4:5' | '16:9' | '3:2';
}

const RATIO_TO_HEIGHT: Record<NonNullable<MediaOptions['ratio']>, number> = {
  '3:4': 4 / 3,
  '4:5': 5 / 4,
  '16:9': 9 / 16,
  '3:2': 2 / 3,
};

/** Resolve a media key to a URL for the active source. */
export function media(key: string, options: MediaOptions = {}): string {
  if (MEDIA_SOURCE === 'unsplash') {
    const id = UNSPLASH_IDS[key];
    if (id) {
      const width = options.width ?? 1600;
      const height = Math.round(width * RATIO_TO_HEIGHT[options.ratio ?? '3:4']);
      return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
    }
  }
  if (MEDIA_SOURCE === 'cdn' && CDN_ROOT) {
    return `${CDN_ROOT}/${key}.jpg`;
  }
  return `${localRoot()}/${key}.jpg`;
}

/** Bundled study used whenever a remote image fails to load. */
export function mediaFallback(key: string): string {
  return `${localRoot()}/${key}.jpg`;
}
