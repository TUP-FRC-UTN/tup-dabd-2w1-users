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

import $ from 'jquery';
import 'datatables.net'
import 'datatables.net-bs5';

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

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (data: UserModel[]) => {
        this.users = data;
        
  
        // Inicializar DataTables después de cargar los datos
        setTimeout(() => {
          $('#myTable').DataTable({
            paging: true,
            searching: true,
            ordering: false,
            lengthChange: false,
            pageLength: 10,
            columns: [
              { title: 'Nombre' },
              { title: 'Rol' },
              { title: 'Nro. de lote', className: 'text-start' },
              { title: 'Fecha de creación' },
              { 
                title: 'Acciones', 
                render: (data, type, row, meta) => {
                  return `
                    <div class="dropdown-center d-flex align-items-center">
                      <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item view-user" data-id="${meta.row}"
                         data-bs-toggle="modal" data-bs-target="#infoUser">Ver más</a></li>
                        <li><a class="dropdown-item">Editar</a></li>
                      </ul>
                    </div>
                  `;
                }
                
              }
            ],
            data: this.users.map(user => [
              `${user.lastname}, ${user.name}`,  // Nombre completo
              user.roles.join(', '),            // Roles
              1234,                             // Nro. de lote (puedes ajustar esto)
              user.datebirth,                   // Fecha de nacimiento
              '<button class="btn btn-info">Ver más</button>'  // Ejemplo de acción
            ]),
            language: {
              lengthMenu: "Mostrar _MENU_ registros por página",
              zeroRecords: "No se encontraron resultados",
              info: "Mostrando página _PAGE_ de _PAGES_",
              infoEmpty: "No hay registros disponibles",
              infoFiltered: "(filtrado de _MAX_ registros totales)",
              search: "Buscar:",
              paginate: {
                first: "Primera",
                last: "Última",
                next: "Siguiente",
                previous: "Anterior"
              },
              loadingRecords: "Cargando...",
              processing: "Procesando...",
              emptyTable: "No hay datos disponibles en la tabla"
            }
          });
  
          // Alinear la caja de búsqueda a la derecha
          const searchInputWrapper = $('#myTable_filter');
          searchInputWrapper.addClass('d-flex justify-content-start');

                  // Asignar el evento click a los botones "Ver más"
        $('#myTable').on('click', '.view-user', (event) => {
          const id = $(event.currentTarget).data('id');
          const userId = this.users[id].id; // Obtén el ID real del usuario
          this.selectUser(userId); // Llama al método selectUser con el ID correcto
        });
        }, 0);  // Asegurar que la tabla se inicializa en el próximo ciclo del evento
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
  }
  
  

  // Busca el user y se lo pasa al modal
  userModal : UserModel = new UserModel();
  selectUser(id: number) {
    console.log(id);
    
    this.user = id;
    this.apiService.getUserById(id)
      .subscribe({
        next: (data: UserModel) => {
          this.userModal = data;
          
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
        }
      });
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
    const rows = this.users.map(user => [
      `${user.name}, ${user.lastname}`,
      user.email, // Agregado el email
      user.roles.join(', '), // Unir roles en un solo string
      user.datebirth,
      0 // Obtener el lote con el índice correspondiente
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
    const rows = this.users.map(user => [
      `${user.name} ${user.lastname}`,  // Nombre completo
      user.email,                       // Email
      user.roles.join(', '),            // Roles
      user.datebirth,                   // Fecha de nacimiento
      0 // Nro. de lote
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