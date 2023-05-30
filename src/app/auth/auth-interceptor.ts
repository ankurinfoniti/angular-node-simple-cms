import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const authRequest = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authToken),
  });

  return next(authRequest);
};
