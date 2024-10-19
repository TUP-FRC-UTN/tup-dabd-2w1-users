import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../users-servicies/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);


  return true;
};
