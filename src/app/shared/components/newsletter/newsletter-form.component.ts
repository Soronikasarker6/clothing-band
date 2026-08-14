import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { ToastService } from '../../../core/services/toast.service';
import { ICONS } from '../../icons';

/** Reactive newsletter capture with inline validation and a submitted state. */
@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (submitted()) {
      <p class="flex items-center gap-3 py-4 font-sans text-sm text-ink">
        <i-lucide [img]="icons.check" class="h-4 w-4" />
        You're on the list. Look out for the next collection.
      </p>
    } @else {
      <form (ngSubmit)="submit()" novalidate class="w-full">
        <div class="flex items-end gap-4">
          <div class="flex-1">
            <label for="newsletter-email" class="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              autocomplete="email"
              placeholder="Email address"
              class="field"
              [formControl]="email"
              [attr.aria-invalid]="showError()"
              [attr.aria-describedby]="showError() ? 'newsletter-error' : null"
            />
          </div>
          <button type="submit" class="btn-solid shrink-0 px-7 py-3.5">Subscribe</button>
        </div>

        @if (showError()) {
          <p id="newsletter-error" class="mt-3 font-sans text-xs text-clay" role="alert">
            Please enter a valid email address.
          </p>
        }
      </form>
    }
  `,
})
export class NewsletterFormComponent {
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly submitted = signal(false);
  protected readonly touched = signal(false);

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected showError(): boolean {
    return this.touched() && this.email.invalid;
  }

  protected submit(): void {
    this.touched.set(true);
    if (this.email.invalid) return;
    // POST /api/newsletter once the Laravel endpoint is in place.
    this.submitted.set(true);
    this.toast.show('Subscribed', 'Welcome to Maison Atelier.', 'success');
  }
}
