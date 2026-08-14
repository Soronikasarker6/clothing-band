import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ICONS } from '../../icons';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-2" [attr.aria-label]="label()">
      <span class="flex items-center gap-0.5" aria-hidden="true">
        @for (star of stars(); track $index) {
          <i-lucide
            [img]="icons.star"
            [class]="star ? 'h-3 w-3 fill-ink text-ink' : 'h-3 w-3 text-ash'"
          />
        }
      </span>
      @if (showCount() && reviewCount() > 0) {
        <span class="font-sans text-[0.6875rem] tracking-[0.12em] text-stone">
          {{ value().toFixed(1) }} ({{ reviewCount() }})
        </span>
      }
    </span>
  `,
})
export class RatingComponent {
  readonly value = input.required<number>();
  readonly reviewCount = input<number>(0);
  readonly showCount = input<boolean>(true);

  protected readonly icons = ICONS;
  protected readonly stars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i < Math.round(this.value())),
  );
  protected readonly label = computed(
    () => `Rated ${this.value().toFixed(1)} out of 5 from ${this.reviewCount()} reviews`,
  );
}
