import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../users-servicies/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  //si está logeado lo deja ingresar
  if(authService.isLoggedIn()){
    return true;
  }
  //si no, lo redirige al login
  else{
    console.log('Debe loguearse para acceder a esta función')
    router.navigate(['/login'])
    return false;
  }
  
};
