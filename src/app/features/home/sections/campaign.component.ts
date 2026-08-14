import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { media } from '../../../core/config/media.config';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { CAMPAIGN } from '../home.content';

/** Full-bleed campaign band with an overlaid statement. */
@Component({
  selector: 'app-campaign',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative isolate overflow-hidden bg-cream" appReveal>
      <img
        [src]="image"
        [alt]="campaign.title"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-t from-paper/90 via-paper/40 to-transparent
          md:bg-gradient-to-r md:from-paper/92 md:via-paper/45 md:to-transparent"
        aria-hidden="true"
      ></div>

      <div class="shell flex min-h-[34rem] items-end py-16 md:min-h-[42rem] md:items-center">
        <div class="max-w-lg">
          <p class="eyebrow">{{ campaign.eyebrow }}</p>
          <h2
            class="mt-5 font-display text-display-sm uppercase leading-[0.95] text-ink
              md:text-display-md"
          >
            {{ campaign.title }}
          </h2>
          <p class="mt-6 max-w-sm font-sans text-base leading-relaxed text-slate">
            {{ campaign.body }}
          </p>
          <a [routerLink]="campaign.ctaPath" class="btn-solid mt-10">{{ campaign.ctaLabel }}</a>
        </div>
      </div>
    </section>
  `,
})
export class CampaignComponent {
  protected readonly campaign = CAMPAIGN;
  protected readonly image = media(CAMPAIGN.mediaKey, { width: 2000, ratio: '16:9' });
}
