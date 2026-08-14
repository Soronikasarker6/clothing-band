import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { BRAND, FOOTER_COLUMNS } from '../../core/config/site.config';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-ink/10 bg-paper">
      <div class="shell py-16 lg:py-20">
        <div class="grid gap-12 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <p class="font-display text-xl tracking-[0.36em] text-ink">MAISON</p>
            <p class="mt-6 max-w-xs font-sans text-sm leading-relaxed text-stone">
              {{ brand.tagline }}
            </p>
            <p class="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-ash">
              {{ brand.city }} · Est. {{ brand.established }}
            </p>
          </div>

          @for (column of columns; track column.title) {
            <nav class="lg:col-span-2" [attr.aria-label]="column.title">
              <p class="eyebrow">{{ column.title }}</p>
              <ul class="mt-6 space-y-3">
                @for (link of column.links; track link.path) {
                  <li>
                    <a [routerLink]="link.path" class="link-underline font-sans text-sm text-charcoal">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </nav>
          }

          <div class="lg:col-span-2">
            <p class="eyebrow">Follow</p>
            <ul class="mt-6 space-y-3">
              <li>
                <a
                  href="https://instagram.com"
                  rel="noopener noreferrer"
                  target="_blank"
                  class="link-underline inline-flex items-center gap-2 font-sans text-sm text-charcoal"
                >
                  <i-lucide [img]="icons.instagram" class="h-3.5 w-3.5" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:clients@maisonatelier.com"
                  class="link-underline inline-flex items-center gap-2 font-sans text-sm text-charcoal"
                >
                  <i-lucide [img]="icons.mail" class="h-3.5 w-3.5" /> Client care
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-16 flex flex-col gap-4 border-t border-ink/10 pt-8 font-sans text-xs
            text-ash sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ year }} {{ brand.name }}. All rights reserved.</p>
          <ul class="flex flex-wrap gap-x-6 gap-y-2">
            <li><a routerLink="/legal/privacy" class="link-underline">Privacy</a></li>
            <li><a routerLink="/legal/terms" class="link-underline">Terms</a></li>
            <li><a routerLink="/legal/cookies" class="link-underline">Cookies</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly brand = BRAND;
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly icons = ICONS;
  protected readonly year = new Date().getFullYear();
}
