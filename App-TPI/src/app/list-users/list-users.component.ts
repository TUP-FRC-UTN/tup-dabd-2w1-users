import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserModel } from '../models/User';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [HttpClientModule], // Importa aquí el HttpClientModule
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent {
  users: UserModel[] = [];

  getRandomLote(index: number): number {
    return Math.floor(Math.random() * 21) + 1;
  }

  constructor(private http: HttpClient) {
    this.http.get<UserModel[]>("http://localhost:8080/users").subscribe((data: any) => {
      this.users = data.map((user: any) => {
        const userModel = new UserModel();
        userModel.id = user.id;
        userModel.name = user.name;
        userModel.lastname = user.lastname;
        userModel.username = user.username;
        userModel.email = user.email;
        userModel.dni = user.dni;
        userModel.contact_id = user.contact_id;
        userModel.active = user.active;
        userModel.avatar_url = user.avatar_url;
        userModel.datebirth = user.datebirth;
        userModel.roles = user.roles;
        console.log(userModel);
        
        return userModel;
      });
    });
  }
}
