import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { media } from '../../../core/config/media.config';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { BRAND_STORY } from '../home.content';

@Component({
  selector: 'app-brand-story',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="shell py-20 lg:py-28" appReveal>
      <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div class="lg:col-span-6">
          <div class="aspect-[7/8] w-full overflow-hidden bg-cream">
            <img
              [src]="image"
              [alt]="story.title"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
        </div>

        <div class="lg:col-span-6 lg:pl-6">
          <p class="eyebrow">{{ story.eyebrow }}</p>
          <h2 class="mt-5 font-display text-display-sm text-ink lg:text-display-md">
            {{ story.title }}
          </h2>
          <p class="mt-6 max-w-md font-sans text-base leading-relaxed text-slate">
            {{ story.body }}
          </p>

          <dl class="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            @for (pillar of story.pillars; track pillar.title) {
              <div class="border-t border-ink/12 pt-5">
                <dt class="font-sans text-sm uppercase tracking-[0.16em] text-ink">
                  {{ pillar.title }}
                </dt>
                <dd class="mt-2.5 font-sans text-sm leading-relaxed text-stone">
                  {{ pillar.body }}
                </dd>
              </div>
            }
          </dl>

          <a [routerLink]="story.ctaPath" class="btn-ghost mt-12">{{ story.ctaLabel }}</a>
        </div>
      </div>
    </section>
  `,
})
export class BrandStoryComponent {
  protected readonly story = BRAND_STORY;
  protected readonly image = media(BRAND_STORY.mediaKey, { width: 1400, ratio: '4:5' });
}
