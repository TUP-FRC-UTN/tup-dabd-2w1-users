import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserModel } from '../../../users-models/users/User';
import { CommonModule, getLocaleMonthNames } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { GetPlotModel } from '../../../users-models/plot/GetPlot';
import { OwnerService } from '../../../users-servicies/owner.service';
import { Owner } from '../../../users-models/owner/Owner';
import { UsersModalInfoOwnerComponent } from '../users-modal-info-owner/users-modal-info-owner.component';

@Component({
  selector: 'app-users-list-owners',
  standalone: true,
  imports: [],
  templateUrl: './users-list-owners.component.html',
  styleUrl: './users-list-owners.component.css'
})
export class UsersListOwnersComponent {
  owners: Owner[] = [];

  private readonly apiService = inject(OwnerService);
  showDeactivateModal: boolean = false;
  userToDeactivate: number = 0;

  constructor(private router: Router,private modal: NgbModal) { }

  

  ngOnInit() {
    this.apiService.getAll().subscribe({
      next: (data: Owner[]) => {
        // Cambiar guiones por barras en la fecha de nacimiento
        this.owners = data;
        console.log(data);
                 
        
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
              { title: 'Nombre', width: '10%', className: 'text-start' },
              { title: 'Dni', width: '10%', className: 'text-start'},
              { title: 'Fecha de nacimiento', width: '15%', className: 'text-start' },
              { title: 'Cuit/Cuil', width: '15%', className: 'text-start' },
              { title: 'Tipo', width: '15%', className: 'text-start' },
              {
                title: 'Acciones',
                orderable: false,
                width: '15%',
                className: 'text-left',  
                render: (data, type, row, meta) => {
                  const ownerId = this.owners[meta.row].id;
                  return `
                    <div class="dropdown-center d-flex align-items-center">
                      <button class="btn btn-light border border-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item view-owner" data-id="${ownerId}">Ver más</a></li>
                        <li><a class="dropdown-item edit-owner" data-id="${ownerId}">Editar</a></li>
                      </ul>
                    </div>
                  `; // si queremos el ver mas de nuevo <li><a class="dropdown-item view-plot" data-id="${meta.row}">Ver más</a></li>
                }
              }
            ],
            data: this.owners.map(owner => [
               //rellenar por columna
              `${owner.name + ", " + owner.lastname}`,
              owner.dni,
              owner.dateBirth,
              owner.cuitCuil,
              owner.ownerType
              
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
        $('#myTable').on('click', '.view-owner', (event) => {
          const id = $(event.currentTarget).data('id');
          const ownerId = this.owners[id].id; // Obtén el ID real del usuario
          this.abrirModal( ownerId); // Abre el modal en modo "ver"
        });

          // Asignar el evento click a los botones "Editar"
          $('#myTable').on('click', '.edit-owner', (event) => {
            console.log("a");
            
            const userId = $(event.currentTarget).data('id');
            this.redirectEdit(userId); // Redirigir al método de edición
          });


        }, 0); // Asegurar que la tabla se inicializa en el próximo ciclo del evento
      },
      error: (error) => {
        console.error('Error al cargar los lotes:', error);
      }
    });
  }

  async abrirModal(ownerId: number) {
    console.log("Esperando a que userModal se cargue...");
  
    // Espera a que se cargue el usuario seleccionado
    try {
      console.log("Cargando propietario...");
      
      await this.selectOwner(ownerId);
      console.log("Propietario cargado:", this.ownerModel);
      console.log("Abriendo modal...");
      
  
      // Una vez cargado, abre el modal
      const modalRef = this.modal.open(UsersModalInfoOwnerComponent, { size: 'lg', keyboard: false });
      modalRef.componentInstance.ownerModel = this.ownerModel;

      modalRef.result.then((result) => {        
        $('#myTable').DataTable().ajax.reload();
      });

    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  
  redirectEdit(id: number) {
    console.log("b");
    this.router.navigate(['/home/owner/edit', id])
  }

  // Busca el user y se lo pasa al modal
  ownerModel: Owner = new Owner();
   selectOwner(id: number): Promise<Owner> {
       // Mostrar SweetAlert de tipo 'cargando'
     Swal.fire({
       title: 'Cargando lote...',
       html: 'Por favor, espera un momento',
       allowOutsideClick: false, // No permitir cerrar la alerta haciendo clic fuera
       didOpen: () => {
         Swal.showLoading(); // Mostrar indicador de carga
       }
     });
     return new Promise((resolve, reject) => {
       this.apiService.getById(id).subscribe({
         next: (data: Owner) => {
          console.log("daskfsdkf");
          
           this.ownerModel = data;
           console.log("aaaaaa")        
           Swal.close(); // Cerrar SweetAlert
           resolve(data); // Resuelve la promesa cuando los datos se cargan
         },
         error: (error) => {
           console.error('Error al cargar el propietario:', error);
           reject(error); // Rechaza la promesa si ocurre un error
           Swal.close();
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'Hubo un problema al cargar el propietario. Por favor, inténtalo de nuevo.'
           });
         }
       });
     });
  }
}
