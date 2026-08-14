import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { SeoService } from '../../core/services/seo.service';

/**
 * On-brand holding page for modules that land in a later milestone (checkout,
 * account, admin). Copy is supplied through route data so no route renders an
 * unstyled blank screen in the meantime.
 */
@Component({
  selector: 'app-coming-soon-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="shell flex min-h-[68svh] flex-col items-center justify-center py-24 text-center">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h1 class="mt-6 max-w-2xl font-display text-display-sm uppercase text-ink lg:text-display-md">
        {{ title() }}
      </h1>
      <p class="mt-6 max-w-md font-sans text-base leading-relaxed text-slate">{{ body() }}</p>
      <div class="mt-10 flex flex-col gap-3 sm:flex-row">
        <a routerLink="/shop" class="btn-solid">Browse the collection</a>
        <a routerLink="/" class="btn-outline">Back to home</a>
      </div>
    </section>
  `,
})
export class ComingSoonPage {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  private readonly data = toSignal(this.route.data.pipe(map((data) => data)), {
    initialValue: {} as Record<string, unknown>,
  });

  protected readonly eyebrow = computed(() => (this.data()['eyebrow'] as string) ?? 'Maison');
  protected readonly title = computed(() => (this.data()['title'] as string) ?? 'Coming soon');
  protected readonly body = computed(
    () =>
      (this.data()['body'] as string) ??
      'This part of the showroom is being finished. Everything else is ready to explore.',
  );

  constructor() {
    this.seo.apply({
      title: this.title(),
      description: this.body(),
    });
  }
}
