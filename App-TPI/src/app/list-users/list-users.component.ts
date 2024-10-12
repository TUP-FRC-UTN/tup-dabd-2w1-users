import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit, Query } from '@angular/core';
import { UserModel } from '../models/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalInfoUserComponent } from '../modal-info-user/modal-info-user.component';
import { ApiServiceService } from '../servicies/api-service.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

  // Busca el user y se lo pasa al modal
  userModal : UserModel = new UserModel();
  selectUser(id: number) {
    this.user = id;
    this.apiService.getUserById(id)
      .subscribe({
        next: (data: UserModel) => {
          this.userModal = data;
          console.log(this.userModal);
          
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
        }
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

  //SE PUEDEN MODIFICAR LOS VALORES A MOSTRAR EN EL PDF
  exportPdf() {
    const doc = new jsPDF();
  
    // Agregar título centrado
    const title = 'Lista de Usuarios';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 20);
  
    // Obtener columnas de la tabla (añadido 'Email')
    const columns = ['Nombre', 'Email', 'Rol', 'Fecha de creación', 'Nro. de lote'];
  
    // Mapear los datos filtrados a un formato adecuado para jsPDF
    const rows = this.filteredUsers.map(user => [
      `${user.name}, ${user.lastname}`,
      user.email, // Agregado el email
      user.roles.join(', '), // Unir roles en un solo string
      user.datebirth,
      this.getRandomLote(this.filteredUsers.indexOf(user)) // Obtener el lote con el índice correspondiente
    ]);
  
    // Generar la tabla en el PDF usando autoTable
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30, // Ajusta la posición de inicio de la tabla
      theme: 'striped', // Tema de tabla con filas alternadas
      headStyles: { 
        fillColor: [0, 0, 0], // Fondo negro
        textColor: [255, 255, 255], // Texto blanco
        fontStyle: 'bold' // Texto en negrita
      },
    });
  
    // Guardar el PDF
    doc.save('ListaUsuarios.pdf');
  }

  //SE PUEDEN MODIFICAR LOS VALORES A MOSTRAR EN EL EXCEL
  exportexcel() {
    // Crear los datos personalizados para la exportación
    const rows = this.filteredUsers.map(user => [
      `${user.name} ${user.lastname}`,  // Nombre completo
      user.email,                       // Email
      user.roles.join(', '),            // Roles
      user.datebirth,                   // Fecha de nacimiento
      this.getRandomLote(this.filteredUsers.indexOf(user)) // Nro. de lote
    ]);
  
    // Definir las cabeceras de las columnas
    const headers = ['Nombre', 'Email', 'Rol', 'Fecha de nacimiento', 'Nro. de lote'];
  
    // Crear un worksheet (hoja de trabajo) con los datos
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
    // Personalizar estilos (opcional)
    const wsOpts = {
      "!cols": [                       // Establecer el ancho de las columnas
        { wch: 25 },                   // Columna 1
        { wch: 35 },                   // Columna 2
        { wch: 20 },                   // Columna 3
        { wch: 15 },                   // Columna 4
        { wch: 10 }                    // Columna 5
      ]
    };
  
    // Crear el libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');  // Asignar nombre a la hoja
  
    // Guardar el archivo Excel con el nombre definido
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }
}