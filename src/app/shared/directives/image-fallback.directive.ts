import { Directive, input } from '@angular/core';

import { mediaFallback } from '../../core/config/media.config';

/**
 * Swaps in the bundled study when a remote image fails, so a broken CDN never
 * leaves a hole in the grid.
 */
@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
  host: {
    '(error)': 'onError($event)',
  },
})
export class ImageFallbackDirective {
  /** Media key to fall back to. */
  readonly appImageFallback = input.required<string>();

  private failed = false;

  protected onError(event: Event): void {
    if (this.failed) return;
    this.failed = true;
    (event.target as HTMLImageElement).src = mediaFallback(this.appImageFallback());
  }
}
