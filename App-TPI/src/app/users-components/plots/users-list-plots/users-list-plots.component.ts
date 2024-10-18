import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../../../users-models/User';
import { CommonModule, getLocaleMonthNames } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../users-servicies/api-service.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PlotModel } from '../../../users-models/Plot';
import { PlotService } from '../../../users-servicies/plot.service';
import { GetPlotModel } from '../../../users-models/GetPlot';
import { UsersModaInfoPlotComponent } from '../users-moda-info-plot/users-moda-info-plot.component';

@Component({
  selector: 'app-users-list-plots',
  standalone: true,
  imports: [],
  templateUrl: './users-list-plots.component.html',
  styleUrl: './users-list-plots.component.css'
})
export class UsersListPlotsComponent {
  plots: GetPlotModel[] = [];
  private readonly apiService = inject(PlotService);
  showDeactivateModal: boolean = false;
  userToDeactivate: number = 0;

  constructor(private router: Router,private modal: NgbModal) { }

  exportPdf() {
    const doc = new jsPDF();

    const title = 'Lista de Lotes';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 20);
    const columns = ['Lote', 'Manzana', 'Mts.2 Terreno', 'Mts.2 Construidos', 'Tipo Lote', 'Estado'];
  
    const table = $('#myTable').DataTable();
    const visibleRows = table.rows({ search: 'applied' }).data().toArray();
  
    const rows = visibleRows.map((row: any) => [
      `${row[0]}`,
      `${row[1]}`,
      `${row[2]}`,
      `${row[3]}`,
      `${row[4]}`, 
      `${row[5]}`, 
    ]);
  
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: { fillColor: [0, 0, 0] },
      styles: { halign: 'center', valign: 'middle' },
      tableWidth: 'auto',
      margin: { top: 30, left: 20, right: 20 },
    });
  
    doc.save('lotes.pdf');
  }
  
    exportExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.plots.map(lote => ({
          Lote: lote.plot_number,
          Manzana: lote.block_number,
          Mts2Terreno: lote.total_area_in_m2,
          Mts2Construidos: lote.built_area_in_m2,
          TipoLote: lote.plot_type,
          Estado: lote.plot_state,
        })));
      
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Lotes');
      
        XLSX.writeFile(wb, 'lotes.xlsx');    
    }
    

  ngOnInit() {
    this.apiService.getAllPlots().subscribe({
      next: (data: GetPlotModel[]) => {
        // Cambiar guiones por barras en la fecha de nacimiento
        this.plots = data;         
        
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
              { title: 'Lote', width: '10%', className: 'text-start' },
              { title: 'Manzana', width: '10%', className: 'text-start'},
              { title: 'Mts.2 Terreno', width: '15%', className: 'text-start' },
              { title: 'Mts.2 Construidos', width: '15%', className: 'text-start' },
              { title: 'Tipo Lote', width: '15%', className: 'text-start' },
              { title: 'Estado', width: '15%', className: 'text-start' },
              {
                title: 'Acciones',
                orderable: false,
                width: '15%',
                className: 'text-left',  
                render: (data, type, row, meta) => {
                  const userId = this.plots[meta.row].id;
                  return `
                    <div class="dropdown-center d-flex align-items-center">
                      <button class="btn btn-light border border-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul class="dropdown-menu">

                        <li><a class="dropdown-item edit-plot" data-id="${userId}">Editar</a></li>
                      </ul>
                    </div>
                  `; // si queremos el ver mas de nuevo <li><a class="dropdown-item view-plot" data-id="${meta.row}">Ver más</a></li>
                }
              }
            ],
            data: this.plots.map(plot => [
               // Ejemplo de acción
              plot.plot_number,
              plot.block_number,
              plot.total_area_in_m2,
              plot.built_area_in_m2,  
              plot.plot_type,
              plot.plot_state
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
        $('#myTable').on('click', '.view-plot', (event) => {
          const id = $(event.currentTarget).data('id');
          const userId = this.plots[id].id; // Obtén el ID real del usuario
          this.abrirModal( userId); // Abre el modal en modo "ver"
        });

          // Asignar el evento click a los botones "Editar"
          $('#myTable').on('click', '.edit-plot', (event) => {
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

  async abrirModal(plotId: number) {
    console.log("Esperando a que userModal se cargue...");
  
    // Espera a que se cargue el usuario seleccionado
    try {
      console.log("Cargando lote...");
      
      await this.selectUser(plotId);
      console.log("lote cargado:", this.plotModel);
      console.log("Abriendo modal...");
      
  
      // Una vez cargado, abre el modal
      const modalRef = this.modal.open(UsersModaInfoPlotComponent, { size: 'md', keyboard: false });
      modalRef.componentInstance.plotModel = this.plotModel;

      modalRef.result.then((result) => {        
        $('#myTable').DataTable().ajax.reload();
      });

    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  
  redirectEdit(id: number) {
    console.log("b");
    this.router.navigate(['/home/plots/edit', id])
  }

  // Busca el user y se lo pasa al modal
  plotModel: GetPlotModel = new GetPlotModel();
   selectUser(id: number): Promise<GetPlotModel> {
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
       this.apiService.gePlotById(id).subscribe({
         next: (data: GetPlotModel) => {
           this.plotModel = data;        
           Swal.close(); // Cerrar SweetAlert
           resolve(data); // Resuelve la promesa cuando los datos se cargan
         },
         error: (error) => {
           console.error('Error al cargar el lote:', error);
           reject(error); // Rechaza la promesa si ocurre un error
           Swal.close();
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'Hubo un problema al cargar el lote. Por favor, inténtalo de nuevo.'
           });
         }
       });
     });
  }
}
