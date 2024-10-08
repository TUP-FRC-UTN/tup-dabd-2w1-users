import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, Query } from '@angular/core';
import { UserModel } from '../models/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalInfoUserComponent } from '../modal-info-user/modal-info-user.component';
import { ApiServiceService } from '../servicies/api-service.service';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ModalInfoUserComponent], // Importa aquí el HttpClientModule
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})export class ListUsersComponent implements OnInit { 
  user: number = 0; 
  users: UserModel[] = [];
  private readonly apiService = inject(ApiServiceService);
  filteredUsers: UserModel[] = [];
  availableRoles: string[] = ['Admin', 'User', 'Owner', 'Security']; // Ajusta según tus roles disponibles
  selectedFilter: string = ''; // Almacena el filtro seleccionado (role, date)
  filterValue: string = ''; // Almacena el valor del filtro por rol o nombre
  startDate: string = ''; // Almacena el valor del filtro de fecha de inicio
  endDate: string = ''; // Almacena el valor del filtro de fecha de fin

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (data: UserModel[]) => {
        this.filteredUsers = data;
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      }
    });
    }

  selectUser(id: number) {
    this.user = id;
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