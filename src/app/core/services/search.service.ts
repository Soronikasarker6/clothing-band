import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { StorageService } from './storage.service';

const STORAGE_KEY = 'maison.recent-searches.v1';
const MAX_RECENT = 6;

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly storage = inject(StorageService);
  private readonly recent = signal<readonly string[]>(
    this.storage.read<readonly string[]>(STORAGE_KEY, []),
  );

  readonly recentSearches = this.recent.asReadonly();
  readonly hasRecent = computed(() => this.recent().length > 0);

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.recent()));
  }

  remember(term: string): void {
    const value = term.trim();
    if (value.length < 2) return;
    this.recent.update((list) =>
      [value, ...list.filter((t) => t.toLowerCase() !== value.toLowerCase())].slice(0, MAX_RECENT),
    );
  }

  clear(): void {
    this.recent.set([]);
  }
}
