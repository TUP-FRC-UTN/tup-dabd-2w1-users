import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);

  async login(email: string): Promise<void> {
    await this.loginService.setUser(email);

    //obtener id y roles
    const userId = this.loginService.getUserId();
    const userRoles = this.loginService.getUserRoles();

    if (userId !== null && userRoles !== null) {
      
        //guardarlos en el localstorage
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userRoles', JSON.stringify(userRoles));
    }
  }

  //verifiar si el id existe ene l localstorage
  isLoggedIn(): boolean {
    return localStorage.getItem('userId') !== null;
  }

  //verificar si tiene cierto rol
  hasRole(role: string): boolean {
    const userRoles: string[] = JSON.parse(
      localStorage.getItem('userRoles') || '[]'
    );
    return userRoles.includes(role);
  }

  //eliminar los datos del usuario
  logOut() : void{
    localStorage.removeItem('userId');
    localStorage.removeItem('userRoles');
  }
}
