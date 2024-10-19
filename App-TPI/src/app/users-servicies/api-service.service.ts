import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../users-models/User';
import { RolModel } from '../users-models/Rol';
import { UserPost } from '../users-models/UserPost';
import { LoginUser } from '../users-models/Login';
import { UserPut } from '../users-models/UserPut';
import { map } from 'rxjs/operators';
import { DeleteUser } from '../users-models/owner/DeleteUser';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8080/';

  constructor() { }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.url + "users").pipe(
      map((users: UserModel[]) => users.filter(user => user.active)) // Filtra solo los usuarios activos
    );
  }

  verifyLogin(user: LoginUser): Observable<LoginUser> {
    return this.http.post<LoginUser>(this.url + "users/login", user);
  }   

  getAllRoles(): Observable<RolModel[]> {
    return this.http.get<RolModel[]>(this.url + "roles");
  }

  getUserById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(this.url + "users/get/" + id);
  }

  getUserByEmail(email: string): Observable<UserModel> {
    return this.http.get<UserModel>(this.url + "users/" + email);
  }

  postUser(user: UserPost): Observable<UserModel> {    
    return this.http.post<UserModel>(this.url + "users", user);
  } 

  putUser(user: UserPut, id: number): Observable<UserPut> {
    return this.http.put<UserPut>(`${this.url}users/${id}`, user);
  }

  desactivateUser( user: DeleteUser): Observable<any> {
    return this.http.delete(`${this.url}users/${user.id}/${user.userIdUpdate}`); 
  }
}
