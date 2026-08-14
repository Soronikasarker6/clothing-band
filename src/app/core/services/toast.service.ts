import { Injectable, signal } from '@angular/core';

export type ToastTone = 'default' | 'success' | 'error';

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly detail?: string;
  readonly tone: ToastTone;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly items = signal<readonly Toast[]>([]);
  private nextId = 1;

  readonly toasts = this.items.asReadonly();

  show(message: string, detail?: string, tone: ToastTone = 'default', ttlMs = 3600): void {
    const id = this.nextId++;
    this.items.update((list) => [...list, { id, message, detail, tone }]);
    setTimeout(() => this.dismiss(id), ttlMs);
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }
}
