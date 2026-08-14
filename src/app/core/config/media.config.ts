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

export const MEDIA_SOURCE: MediaSource = 'local';

/** Root for bundled assets. */
const LOCAL_ROOT = '/media';

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
  return `${LOCAL_ROOT}/${key}.jpg`;
}

/** Bundled study used whenever a remote image fails to load. */
export function mediaFallback(key: string): string {
  return `${LOCAL_ROOT}/${key}.jpg`;
}
