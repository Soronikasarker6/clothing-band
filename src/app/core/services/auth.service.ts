import { Injectable, computed, effect, inject, signal } from '@angular/core';

import type { AuthSession, User } from '../models/user.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'maison.session.v1';

/**
 * Session state only. Credential exchange moves to the Laravel Sanctum
 * endpoints (`POST /api/auth/login`) when the backend module lands; the public
 * surface here does not change.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly session = signal<AuthSession | null>(
    this.storage.read<AuthSession | null>(STORAGE_KEY, null),
  );

  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly isAdmin = computed(() => this.session()?.user.role === 'admin');

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.session()));
  }

  token(): string | null {
    return this.session()?.token ?? null;
  }

  setSession(session: AuthSession): void {
    this.session.set(session);
  }

  signOut(): void {
    this.session.set(null);
  }
}
