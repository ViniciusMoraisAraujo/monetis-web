import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token();

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      let apiError: ApiError;

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/auth/login']);
        }

        if (typeof error.error === 'string') {
          apiError = {
            statusCode: error.status,
            message: error.error,
            details: null
          };
        } else if (error.error && typeof error.error === 'object') {
          const errObj = error.error as Record<string, unknown>;
          apiError = {
            statusCode: typeof errObj['statusCode'] === 'number' ? errObj['statusCode'] : error.status,
            message: typeof errObj['message'] === 'string' ? errObj['message'] : error.message,
            errorCode: typeof errObj['errorCode'] === 'string' ? errObj['errorCode'] : undefined,
            details: errObj['details'] ?? null
          };
        } else {
          apiError = {
            statusCode: error.status,
            message: error.message || 'Erro inesperado na comunicação com o servidor',
            details: null
          };
        }
      } else {
        apiError = {
          statusCode: 0,
          message: 'Erro desconhecido na requisição',
          details: error
        };
      }

      return throwError(() => apiError);
    })
  );
};
