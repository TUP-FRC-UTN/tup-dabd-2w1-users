import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { UserGet } from '../users-models/users/UserGet';
import { KJUR } from 'jsrsasign';
import { UserLoged } from '../users-models/users/UserLoged';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  
  async login(data: any): Promise<void> {
    this.saveToken(data.token);
    this.getUser();
  }

  //Obtiene el token y genera un UserLoged
  getUser(): UserLoged{
    var user = new UserLoged();
      const decodedToken: any = KJUR.jws.JWS.parse(this.getToken() || '');
      user.id = decodedToken.payloadObj.id;
      user.roles = decodedToken.payloadObj.roles;
      user.name = decodedToken.payloadObj.name;
      user.lastname = decodedToken.payloadObj.lastname;
      user.plotId = decodedToken.payloadObj.plot_id;
    
    return user;
  }

  //Guarda el token en LocalStorage
  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  //Obtiene el token del almacenamiento
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  //Elimina el token
  logOut() {
    localStorage.removeItem('jwtToken');
  }

  //Verifica si el id existe ene l localstorage
  isLoggedIn(): boolean {
    return localStorage.getItem('jwtToken') !== null;
  }

  //Verifica si tiene cierto rol
  hasRole(role: string): boolean {
    return this.getUser().roles.includes(role); 
  }
}
