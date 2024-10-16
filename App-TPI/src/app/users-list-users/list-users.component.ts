import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../models/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalInfoUserComponent } from '../modal-info-user/modal-info-user.component';
import { ApiServiceService } from '../servicies/api-service.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ModalInfoUserComponent, RouterModule],
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit { 

  typeModal: string = '';
  user: number = 0; 
  users: UserModel[] = [];
  private readonly apiService = inject(ApiServiceService);
  showDeactivateModal: boolean = false;
  userToDeactivate: number = 0;

  constructor(private router: Router,private modal: NgbModal) { }

  

  ngOnInit() {
    this.apiService.getAllUsers().subscribe({
      next: (data: UserModel[]) => {
        // Cambiar guiones por barras en la fecha de nacimiento
        this.users = data.map(user => ({
          ...user,
          datebirth: user.datebirth.replace(/-/g, '/') // Cambia 'dd-mm-yyyy' a 'dd/mm/yyyy'
        }));
        
        
        // Inicializar DataTables después de cargar los datos
        setTimeout(() => {
          const table = $('#myTable').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            lengthChange: true,
            order: [[0, 'asc']],
            pageLength: 10,
            columns: [
              { title: 'Nombre', width: '30%' },
              { title: 'Rol', width: '20%' },
              { title: 'Nro. de lote', className: 'text-start', width: '15%' },
              { title: 'Fecha de creación', width: '20%' },
              {
                title: 'Acciones',
                orderable: false,
                width: '15%',
                className: 'text-left',  
                render: (data, type, row, meta) => {
                  const userId = this.users[meta.row].id;
                  return `
                    <div class="dropdown-center d-flex align-items-center">
                      <button class="btn btn-light border border-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item view-user" data-id="${meta.row}">Ver más</a></li>
                        <li><a class="dropdown-item edit-user" data-id="${userId}">Editar</a></li>
                        <li><a class="dropdown-item delete-user" data-id="${meta.row}">Eliminar</a></li>
                      </ul>
                    </div>
                  `;
                }
              }
            ],
            data: this.users.map(user => [
              `${user.lastname}, ${user.name}`,  // Nombre completo
              user.roles.join(', '),              // Roles
              1234,                                // Nro. de lote (puedes ajustar esto)
              user.datebirth,                      // Fecha de nacimiento ya con el formato deseado
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
            },
            createdRow: function (row, data, dataIndex) {
              if (dataIndex % 2 === 0) {
                $(row).css('background-color', '#f9f9f9');  // Color de fondo para filas pares
              } else {
                $(row).css('background-color', '#ffffff');  // Color de fondo para filas impares
              }
            }
          });    

          // Añadir estilos adicionales al DataTable
          $('#myTable').css({
            'border-collapse': 'separate',
            'border-spacing': '0 10px',  // Espacio entre filas
            'width': '100%',  // Ancho completo de la tabla
            'border': '1px solid #ddd',
            'padding-left': '15px'  // Borde para toda la tabla
          });

          // Alinear la caja de búsqueda a la derecha
          const searchInputWrapper = $('#myTable_filter');
          searchInputWrapper.addClass('d-flex justify-content-start');

          // Desvincular el comportamiento predeterminado de búsqueda
          $('#myTable_filter input').unbind(); 
          $('#myTable_filter input').bind('input', (event) => { // Usar función de flecha aquí
              const searchValue = (event.target as HTMLInputElement).value; // Acceder al valor correctamente
          
              // Comienza a buscar solo si hay 3 o más caracteres
              if (searchValue.length >= 3) {
                  table.search(searchValue).draw();
              } else {
                  table.search('').draw(); // Limpia la búsqueda si hay menos de 3 caracteres
              }
          });

          // Asignar el evento click a los botones "Ver más"
          // Asignar el evento click a los botones "Ver más"
        $('#myTable').on('click', '.view-user', (event) => {
          const id = $(event.currentTarget).data('id');
          const userId = this.users[id].id; // Obtén el ID real del usuario
          this.abrirModal("info", userId); // Pasa el ID del usuario al abrir el modal
        });


          $('#myTable').on('click', '.delete-user', (event) => {
            const id = $(event.currentTarget).data('id');
            const userId = this.users[id].id; // Obtén el ID real del usuario
            this.abrirModal("delete", userId); // Pasa el ID del usuario al abrir el modal
          });

          // Asignar el evento click a los botones "Editar"
          $('#myTable').on('click', '.edit-user', (event) => {
            const userId = $(event.currentTarget).data('id');
            this.redirectEdit(userId); // Redirigir al método de edición
          });


        }, 0); // Asegurar que la tabla se inicializa en el próximo ciclo del evento
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
  }




  async abrirModal(type: string, userId: number) {
    console.log("Esperando a que userModal se cargue...");
  
    // Espera a que se cargue el usuario seleccionado
    try {
      await this.selectUser(userId);
      console.log("userModal cargado:", this.userModal);
  
      // Una vez cargado, abre el modal
      const modalRef = this.modal.open(ModalInfoUserComponent, { size: 'lg', keyboard: false });
      modalRef.componentInstance.typeModal = type; // Pasar el tipo de modal al componente hijo
      modalRef.componentInstance.userModal = this.userModal;

      modalRef.result.then((result) => {
        console.log("a");
        
        $('#miDataTable').DataTable().ajax.reload();
      });

    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  changeTypeModal(type: string) {
    this.typeModal = type;
  }

  
  redirectEdit(id: number) {
    console.log("Redirigiendo a la edición del usuario con ID:", id);
    this.router.navigate(['/home/users/edit', id]);  
  }

  // Busca el user y se lo pasa al modal
  userModal: UserModel = new UserModel();
  selectUser(id: number): Promise<UserModel> {
      // Mostrar SweetAlert de tipo 'cargando'
    Swal.fire({
      title: 'Cargando usuario...',
      html: 'Por favor, espera un momento',
      allowOutsideClick: false, // No permitir cerrar la alerta haciendo clic fuera
      didOpen: () => {
        Swal.showLoading(); // Mostrar indicador de carga
      }
    });
    return new Promise((resolve, reject) => {
      this.user = id;
      this.apiService.getUserById(id).subscribe({
        next: (data: UserModel) => {
          this.userModal = data;
          Swal.close(); // Cerrar SweetAlert
          resolve(data); // Resuelve la promesa cuando los datos se cargan
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
          reject(error); // Rechaza la promesa si ocurre un error
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar el usuario. Por favor, inténtalo de nuevo.'
          });
        }
      });
    });
  }
  

  // SE PUEDEN MODIFICAR LOS VALORES A MOSTRAR EN EL PDF
  exportPdf() {
    const doc = new jsPDF();
  
    // Agregar título centrado
    const title = 'Lista de Usuarios';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 20);
  
    // Obtener columnas de la tabla (añadido 'Email')
    const columns = ['Nombre', 'Rol', 'Nro. de lote', 'Fecha de nacimiento'];
  
    // Filtrar datos visibles en la tabla
    const table = $('#myTable').DataTable(); // Inicializa DataTable una vez
  
    // Cambia la forma de obtener las filas visibles usando 'search' en lugar de 'filter'
    const visibleRows = table.rows({ search: 'applied' }).data().toArray(); // Usar 'search: applied'
  
    // Mapear los datos filtrados a un formato adecuado para jsPDF
    const rows = visibleRows.map((row: any) => [
      `${row[0]}`,       // Nombre
      `${row[1]}`,       // Rol
      `${row[2]}`,       // Lote
      row[3].replace(/-/g, '/'), // Fecha nacimiento
    ]);
  
    // Generar la tabla en el PDF usando autoTable
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30, // Ajusta la posición de inicio de la tabla
      theme: 'striped', // Tema de tabla con filas alternadas
      headStyles: { fillColor: [0, 0, 0] }, // Color de fondo del encabezado
      styles: { halign: 'center', valign: 'middle' }, // Alineación del contenido
      columnStyles: { 
        0: { cellWidth: 50 }, 
        1: { cellWidth: 30 }, 
        2: { cellWidth: 30 }, 
        3: { cellWidth: 50 }, 
        4: { cellWidth: 30 } 
      }, // Ajusta el ancho de las columnas
    });
  
    doc.save('usuarios.pdf'); // Descarga el archivo PDF
  }

  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users.map(user => ({
      Nombre: `${user.lastname}, ${user.name}`,
      Rol: user.roles.join(', '),
      Lote: 1234,
      FechaNacimiento: user.datebirth.replace(/-/g, '/'), // Cambia el formato de la fecha aquí
    })));
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
  
    XLSX.writeFile(wb, 'usuarios.xlsx'); // Descarga el archivo Excel
  }
}
