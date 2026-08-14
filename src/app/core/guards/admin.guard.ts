import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.createUrlTree(['/account'], { queryParams: { admin: 1 } });
};
