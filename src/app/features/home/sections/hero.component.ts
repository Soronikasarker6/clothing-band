import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { media } from '../../../core/config/media.config';
import { HERO } from '../home.content';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="relative isolate overflow-hidden bg-paper lg:flex lg:min-h-[92svh] lg:items-end"
    >
      <!-- Portrait screens: the image sits above the statement rather than behind it,
           so nothing is read through a scrim. -->
      <div class="relative h-[54svh] w-full bg-cream lg:hidden">
        <img
          [src]="mobileImage"
          alt="Autumn winter essentials from the Maison Atelier collection"
          fetchpriority="high"
          decoding="async"
          class="h-full w-full object-cover"
        />
      </div>

      <!-- Wide screens: full-bleed image with a warm left-to-right scrim. -->
      <img
        [src]="desktopImage"
        alt=""
        aria-hidden="true"
        decoding="async"
        class="absolute inset-0 -z-10 hidden h-full w-full object-cover lg:block"
      />
      <div
        class="absolute inset-0 -z-10 hidden bg-gradient-to-r from-paper from-0% via-paper/45
          via-28% to-transparent to-52% lg:block"
        aria-hidden="true"
      ></div>

      <div class="shell w-full pb-16 pt-10 lg:pb-28 lg:pt-32">
        <div class="max-w-2xl">
          <p class="eyebrow animate-fade-in">{{ hero.eyebrow }}</p>

          <h1
            class="mt-6 font-display text-[2.625rem] uppercase leading-[0.94] text-ink
              min-[420px]:text-display-md sm:text-display-lg xl:text-display-xl"
          >
            @for (line of hero.titleLines; track line; let i = $index) {
              <span
                class="block animate-fade-up"
                [style.animation-delay]="80 + i * 110 + 'ms'"
                >{{ line }}</span
              >
            }
          </h1>

          <p
            class="mt-8 max-w-md animate-fade-up font-sans text-base leading-relaxed text-slate"
            style="animation-delay: 320ms"
          >
            {{ hero.body }}
          </p>

          <div
            class="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row sm:gap-4"
            style="animation-delay: 420ms"
          >
            <a [routerLink]="hero.primary.path" class="btn-solid justify-center sm:px-12">
              {{ hero.primary.label }}
            </a>
            <a [routerLink]="hero.secondary.path" class="btn-outline justify-center sm:px-12">
              {{ hero.secondary.label }}
            </a>
          </div>
        </div>
      </div>

      <span
        class="pointer-events-none absolute bottom-8 right-8 hidden font-sans text-[0.625rem]
          uppercase tracking-[0.28em] text-stone lg:block"
        aria-hidden="true"
      >
        Scroll
      </span>
    </section>
  `,
})
export class HeroComponent {
  protected readonly hero = HERO;
  protected readonly desktopImage = media(HERO.mediaKey, { width: 2400, ratio: '16:9' });
  protected readonly mobileImage = media(HERO.mobileMediaKey, { width: 1100, ratio: '3:4' });
}
