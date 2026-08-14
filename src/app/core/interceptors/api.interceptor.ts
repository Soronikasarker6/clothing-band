import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Attaches the bearer token issued by Laravel Sanctum and surfaces transport
 * failures as a single, consistent toast instead of a silent console error.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const token = auth.token();

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    : req.clone({ setHeaders: { Accept: 'application/json' } });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.signOut();
        toast.show('Session expired', 'Please sign in again.', 'error');
      } else if (error.status >= 500) {
        toast.show('Something went wrong', 'Please try again in a moment.', 'error');
      }
      return throwError(() => error);
    }),
  );
};
