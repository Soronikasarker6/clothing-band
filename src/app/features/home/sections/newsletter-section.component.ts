import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NewsletterFormComponent } from '../../../shared/components/newsletter/newsletter-form.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';
import { NEWSLETTER } from '../home.content';

@Component({
  selector: 'app-newsletter-section',
  standalone: true,
  imports: [NewsletterFormComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="border-t border-ink/10 bg-cream" appReveal>
      <div class="shell py-20 lg:py-24">
        <div class="mx-auto max-w-xl text-center">
          <h2 class="font-display text-display-sm text-ink">{{ newsletter.title }}</h2>
          <p class="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-slate">
            {{ newsletter.body }}
          </p>
          <div class="mx-auto mt-10 max-w-md text-left">
            <app-newsletter-form />
          </div>
          <p class="mt-6 font-sans text-xs text-ash">
            By subscribing you agree to our privacy policy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class NewsletterSectionComponent {
  protected readonly newsletter = NEWSLETTER;
}
