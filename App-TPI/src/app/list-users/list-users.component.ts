import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserModel } from '../models/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule ], // Importa aquí el HttpClientModule
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})export class ListUsersComponent {
  users: UserModel[] = [];
  filteredUsers: UserModel[] = [];
  availableRoles: string[] = ['Admin', 'User', 'Owner', 'Security']; // Ajusta según tus roles disponibles
  selectedFilter: string = ''; // Almacena el filtro seleccionado (role, date)
  filterValue: string = ''; // Almacena el valor del filtro por rol o nombre
  startDate: string = ''; // Almacena el valor del filtro de fecha de inicio
  endDate: string = ''; // Almacena el valor del filtro de fecha de fin

  showFilterName : boolean = false;

  changeFilterName(){
    this.showFilterName = !this.showFilterName;
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
        return userModel;
      });
      this.filteredUsers = [...this.users]; // Inicialmente, no hay filtro
    });
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.filterValue = '';
    this.startDate = '';
    this.endDate = '';
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(user => {
      let matches = true;

      // Filtrar por Rol
      if (this.selectedFilter === 'role' && this.filterValue) {
        matches = matches && user.roles.includes(this.filterValue);
      }

      // Filtrar por Fecha de Creación
      if (this.selectedFilter === 'date' && this.startDate && this.endDate) {
        const userDate = new Date(user.datebirth);
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        matches = matches && userDate >= start && userDate <= end;
      }

      return matches;
    });
  }

  filterByName(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.lastname.toLowerCase().includes(searchTerm)
    );
  }

  getRandomLote(index: number): number {
    return Math.floor(Math.random() * 21) + 1;
  }
}