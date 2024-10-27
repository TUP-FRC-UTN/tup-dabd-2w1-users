import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserGet } from '../../../users-models/users/UserGet';
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
            lengthMenu: [10, 25, 50],
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
              
            ]), dom:
            '<"mb-3"t>' +                           
            '<"d-flex justify-content-between"lp>',

            language: {
              lengthMenu: "_MENU_",
              zeroRecords: "No se encontraron resultados",
              info: "Mostrando página _PAGE_ de _PAGES_",
              infoEmpty: "No hay registros disponibles",
              infoFiltered: "(filtrado de _MAX_ registros totales)",
              search: "Buscar:",
              paginate: {
                first: "<<",
                last: ">>",
                next: ">",
                previous: "<"
              },
              loadingRecords: "Cargando...",
              processing: "Procesando...",
              emptyTable: "No hay datos disponibles en la tabla"
            },
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
          
          //Esto daba error por eso lo comente
          //const id = $(event.currentTarget).data('id');
          //const ownerId = this.owners[id].id; 
          const ownerId = $(event.currentTarget).data('id'); // Obtén el ID real del usuario
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
    this.router.navigate(['/home/owners/edit', id])
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

  exportPdf() {
    const doc = new jsPDF();
  
    // Agregar título centrado
    const title = 'Lista de Propietarios';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 20);
  
    // Definir columnas para el PDF
    const columns = ['Nombre', 'DNI', 'Fecha de Nacimiento', 'CUIT/CUIL', 'Tipo'];
  
    // Filtrar datos visibles en la tabla
    const table = $('#myTable').DataTable();
  
    // Obtener las filas visibles de la tabla
    const visibleRows = table.rows({ search: 'applied' }).data().toArray();
  
    // Mapear los datos visibles a un formato adecuado para jsPDF
    const rows = visibleRows.map((row: any) => [
      `${row[0]}`,        // Nombre
      `${row[1]}`,        // DNI
      `${row[2].replace(/-/g, '/')}`, // Fecha de nacimiento
      `${row[3]}`,        // CUIT/CUIL
      `${row[4]}`         // Tipo
    ]);
  
    // Generar la tabla en el PDF usando autoTable
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [0, 0, 0] },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: { 
        0: { cellWidth: 50 }, 
        1: { cellWidth: 30 }, 
        2: { cellWidth: 30 }, 
        3: { cellWidth: 50 }, 
        4: { cellWidth: 30 } 
      },
    });
  
    doc.save('propietarios.pdf'); // Descargar el archivo PDF
  }
  
  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.owners.map(owner => ({
      Nombre: `${owner.lastname}, ${owner.name}`,
      DNI: owner.dni,
      FechaNacimiento: owner.dateBirth.replace(/-/g, '/'), // Formato de la fecha
      CUIT_CUIL: owner.cuitCuil,
      Tipo: owner.ownerType
    })));
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Propietarios');
  
    XLSX.writeFile(wb, 'propietarios.xlsx'); // Descargar el archivo Excel
  }
  
}
