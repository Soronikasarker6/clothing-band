import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { ICONS } from '../../icons';

/** Eyebrow + display heading + optional trailing link, used across every section. */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-2xl">
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h2 class="mt-4 font-display text-display-sm text-ink md:text-display-md">
          {{ heading() }}
        </h2>
        @if (description()) {
          <p class="mt-4 max-w-md font-sans text-sm leading-relaxed text-slate">
            {{ description() }}
          </p>
        }
      </div>

      @if (linkPath()) {
        <a
          [routerLink]="linkPath()"
          class="link-underline inline-flex items-center gap-2 pb-1 font-sans text-[0.6875rem]
            uppercase tracking-[0.22em] text-ink"
        >
          {{ linkLabel() }}
          <i-lucide [img]="icons.arrowRight" class="h-3.5 w-3.5" />
        </a>
      }
    </div>
  `,
})
export class SectionHeadingComponent {
  readonly eyebrow = input<string>('');
  readonly heading = input.required<string>();
  readonly description = input<string>('');
  readonly linkPath = input<string>('');
  readonly linkLabel = input<string>('View all');

  protected readonly icons = ICONS;
}
