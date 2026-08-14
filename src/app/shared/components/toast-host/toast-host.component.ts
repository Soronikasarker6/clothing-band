import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { ToastService } from '../../../core/services/toast.service';
import { ICONS } from '../../icons';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-center gap-2
        sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      role="status"
      aria-live="polite"
    >
      @for (toast of toasts(); track toast.id) {
        <div
          class="animate-fade-up pointer-events-auto flex w-full items-start gap-4 border
            border-ink/10 bg-paper px-5 py-4 shadow-[0_18px_40px_-24px_rgba(15,15,14,0.5)]
            sm:w-80"
        >
          <div class="flex-1">
            <p class="font-sans text-[0.8125rem] text-ink">{{ toast.message }}</p>
            @if (toast.detail) {
              <p class="mt-1 font-sans text-xs text-stone">{{ toast.detail }}</p>
            }
          </div>
          <button
            type="button"
            class="text-stone transition-colors hover:text-ink"
            (click)="dismiss(toast.id)"
            aria-label="Dismiss notification"
          >
            <i-lucide [img]="icons.close" class="h-3.5 w-3.5" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastHostComponent {
  private readonly service = inject(ToastService);

  protected readonly toasts = this.service.toasts;
  protected readonly icons = ICONS;

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
