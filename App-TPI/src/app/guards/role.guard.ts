import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../users-servicies/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  //rol que puede acceder al componente
  const requiredRoles = route.data['roles'] as string[];
  
  //ver si el usuario tiene alguno de los roles permitidos
  console.log(requiredRoles);
  
  const hasValidRole = requiredRoles.some((role) =>    
    authService.hasRole(role)
  );

  //si tiene permisos
  if (hasValidRole) {
    return true;
  } 
  
  //si no tiene permisos
  else {
    router.navigate(['unauthorized']);
    return false;
  }
};
