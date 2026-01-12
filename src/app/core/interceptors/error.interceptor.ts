import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gérer les erreurs 401 (non authentifié)
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }

      // Gérer les erreurs 403 (accès refusé)
      if (error.status === 403) {
        console.error('Accès refusé:', error.error);
        // Rediriger vers le dashboard approprié
        authService.redirectByRole();
      }

      // Logger l'erreur
      const errorMessage = errorHandler.handleHttpError(error);
      console.error('Erreur HTTP interceptée:', errorMessage);

      return throwError(() => error);
    })
  );
};
