import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import type { ColorOption } from '../../../core/models/catalog.model';

@Component({
  selector: 'app-color-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset>
      <legend class="sr-only">{{ legend() }}</legend>
      <div class="flex flex-wrap items-center gap-3" role="radiogroup" [attr.aria-label]="legend()">
        @for (color of colors(); track color.id) {
          <button
            type="button"
            role="radio"
            [attr.aria-checked]="selected() === color.id"
            [attr.aria-label]="color.name"
            [title]="color.name"
            (click)="selected.set(color.id)"
            class="relative grid h-7 w-7 place-items-center rounded-full transition-transform
              duration-300 ease-[var(--ease-editorial)] hover:scale-110"
          >
            <span
              class="h-4 w-4 rounded-full ring-1 ring-ink/12 ring-inset"
              [style.background-color]="color.swatch"
            ></span>
            <span
              class="pointer-events-none absolute inset-0 rounded-full border transition-colors
                duration-300"
              [class.border-ink]="selected() === color.id"
              [class.border-transparent]="selected() !== color.id"
            ></span>
          </button>
        }
      </div>
    </fieldset>
  `,
})
export class ColorSelectorComponent {
  readonly colors = input.required<readonly ColorOption[]>();
  readonly selected = model.required<string>();
  readonly legend = input<string>('Colour');
}
