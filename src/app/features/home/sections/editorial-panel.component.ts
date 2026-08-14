import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { media } from '../../../core/config/media.config';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import type { EditorialPanel } from '../home.content';

/** Large image + statement block. Used for both gender collection panels. */
@Component({
  selector: 'app-editorial-panel',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grid items-stretch gap-0 md:grid-cols-2" appReveal>
      <div
        class="relative aspect-[4/5] w-full overflow-hidden bg-cream"
        [class]="reverse() ? 'md:order-2' : ''"
      >
        <img
          [src]="image()"
          [alt]="panel().title"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition-transform
            duration-[1400ms] ease-[var(--ease-editorial)] hover:scale-[1.03]"
        />
      </div>

      <div
        class="flex flex-col justify-center bg-linen px-6 py-14 sm:px-12 lg:px-20 lg:py-24"
        [class]="reverse() ? 'md:order-1' : ''"
      >
        <p class="eyebrow">{{ panel().eyebrow }}</p>
        <h2 class="mt-5 font-display text-display-sm uppercase text-ink lg:text-display-md">
          {{ panel().title }}
        </h2>
        <p class="mt-6 max-w-sm font-display text-xl italic leading-snug text-graphite lg:text-2xl">
          “{{ panel().quote }}”
        </p>
        <a [routerLink]="panel().ctaPath" class="btn-outline mt-10 self-start">
          {{ panel().ctaLabel }}
        </a>
      </div>
    </section>
  `,
})
export class EditorialPanelComponent {
  readonly panel = input.required<EditorialPanel>();
  /** Places the image on the right at desktop widths. */
  readonly reverse = input<boolean>(false);

  protected readonly image = computed(() =>
    media(this.panel().mediaKey, { width: 1400, ratio: '4:5' }),
  );
}
