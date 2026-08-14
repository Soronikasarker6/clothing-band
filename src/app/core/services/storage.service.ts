import { Injectable } from '@angular/core';

/**
 * Thin, SSR-safe wrapper around localStorage. Services persist through this so
 * no feature has to guard for a missing browser environment itself.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly available = typeof localStorage !== 'undefined';

  read<T>(key: string, fallback: T): T {
    if (!this.available) return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  write(key: string, value: unknown): void {
    if (!this.available) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private mode — state simply does not persist */
    }
  }
}
