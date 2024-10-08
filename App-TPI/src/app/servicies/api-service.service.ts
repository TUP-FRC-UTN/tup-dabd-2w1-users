import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/User';
import { RolModel } from '../models/Rol';
import { UserPost } from '../models/UserPost';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8080/';

  constructor() { }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.url + "users");
  }

  getAllRoles(): Observable<RolModel[]> {
    return this.http.get<RolModel[]>(this.url + "roles");
  }

  postUser(user: UserPost): Observable<UserModel> {    
    return this.http.post<UserModel>(this.url + "users", user);
  } 
}
