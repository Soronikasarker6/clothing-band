import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import type { SizeCode } from '../../../core/models/catalog.model';

@Component({
  selector: 'app-size-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between">
      <span class="eyebrow">Size</span>
      @if (showGuide()) {
        <button
          type="button"
          class="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-stone
            underline underline-offset-4 transition-colors hover:text-ink"
          (click)="guideRequested.emit()"
        >
          Size guide
        </button>
      }
    </div>

    <div class="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
      @for (size of sizes(); track size) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="selected() === size"
          [disabled]="isDisabled(size)"
          (click)="selected.set(size)"
          class="min-w-14 border px-4 py-3 font-sans text-[0.6875rem] uppercase
            tracking-[0.18em] transition-all duration-300 ease-[var(--ease-editorial)]
            disabled:cursor-not-allowed disabled:text-ash disabled:line-through"
          [class]="stateClasses(size)"
        >
          {{ size }}
        </button>
      }
    </div>
  `,
})
export class SizeSelectorComponent {
  readonly sizes = input.required<readonly SizeCode[]>();
  readonly selected = model.required<SizeCode | null>();
  /** Sizes with no stock in the current colour. */
  readonly unavailable = input<readonly SizeCode[]>([]);
  readonly showGuide = input<boolean>(true);
  readonly guideRequested = output<void>();

  protected isDisabled(size: SizeCode): boolean {
    return this.unavailable().includes(size);
  }

  protected stateClasses(size: SizeCode): string {
    return this.selected() === size
      ? 'border-ink bg-ink text-paper'
      : 'border-ink/15 text-ink hover:border-ink';
  }
}
