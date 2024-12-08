import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentUser()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false;
};