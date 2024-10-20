import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { UserModel } from '../users-models/users/User';
import { KJUR, b64utoutf8 } from 'jsrsasign';
import { get } from 'jquery';
import { UserLoged } from '../users-models/users/UserLoged';





@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private user : UserModel = new UserModel();
  

  async login(data: any): Promise<void> {
    this.saveToken(data.token);
    this.getUser();
  }

  getUser(): UserLoged{
    var user = new UserLoged();
    const decodedToken: any = KJUR.jws.JWS.parse(this.getToken() || '');
    user.id = decodedToken.payloadObj.id;
    user.roles = decodedToken.payloadObj.roles;
    user.name = decodedToken.payloadObj.name;
    user.lastname = decodedToken.payloadObj.lastname;
    user.plotId = decodedToken.payloadObj.plot_id;

    console.log(user);
    
    return user;
  }

  //Guardar el token en LocalStorage
  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  //Obtener el token del almacenamiento
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  //Elimina el token
  logOut() {
    localStorage.removeItem('jwtToken');
  }

  //verifiar si el id existe ene l localstorage
  isLoggedIn(): boolean {
    return localStorage.getItem('jwtToken') !== null;
  }

  //verificar si tiene cierto rol
  hasRole(role: string): boolean {
    var string = this.getUser().roles;
    console.log(string);
    return this.getUser().roles.includes(role); 
  }

}
