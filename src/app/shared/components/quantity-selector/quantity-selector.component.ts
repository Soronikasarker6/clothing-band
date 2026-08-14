import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ICONS } from '../../icons';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inline-flex items-center border border-ink/15">
      <button
        type="button"
        class="grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-cream
          disabled:text-ash"
        [disabled]="quantity() <= min()"
        (click)="step(-1)"
        [attr.aria-label]="'Decrease quantity of ' + label()"
      >
        <i-lucide [img]="icons.minus" class="h-3.5 w-3.5" />
      </button>
      <span
        class="w-10 text-center font-sans text-sm tabular-nums"
        aria-live="polite"
        [attr.aria-label]="'Quantity: ' + quantity()"
        >{{ quantity() }}</span
      >
      <button
        type="button"
        class="grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-cream
          disabled:text-ash"
        [disabled]="quantity() >= max()"
        (click)="step(1)"
        [attr.aria-label]="'Increase quantity of ' + label()"
      >
        <i-lucide [img]="icons.plus" class="h-3.5 w-3.5" />
      </button>
    </div>
  `,
})
export class QuantitySelectorComponent {
  readonly quantity = model.required<number>();
  readonly min = input<number>(1);
  readonly max = input<number>(10);
  readonly label = input<string>('item');

  protected readonly icons = ICONS;

  protected step(delta: number): void {
    const next = this.quantity() + delta;
    if (next < this.min() || next > this.max()) return;
    this.quantity.set(next);
  }
}
