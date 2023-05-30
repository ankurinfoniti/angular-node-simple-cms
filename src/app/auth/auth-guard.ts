import { inject } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.getIsAuth();

  if (!isAuth) {
    return router.navigate(['/login']);
  }

  return true;
};
