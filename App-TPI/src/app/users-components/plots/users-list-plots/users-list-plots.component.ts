import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserGet } from '../../../users-models/users/UserGet';
import { CommonModule, getLocaleMonthNames } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PlotModel } from '../../../users-models/plot/Plot';
import { PlotService } from '../../../users-servicies/plot.service';
import { GetPlotModel } from '../../../users-models/plot/GetPlot';
import { UsersModaInfoPlotComponent } from '../users-moda-info-plot/users-moda-info-plot.component';
import { PlotStateModel } from '../../../users-models/plot/PlotState';
import { PlotTypeModel } from '../../../users-models/plot/PlotType';
import { OwnerService } from '../../../users-servicies/owner.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-list-plots',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users-list-plots.component.html',
  styleUrl: './users-list-plots.component.css'
})
export class UsersListPlotsComponent {
  plots: GetPlotModel[] = [];
  private readonly plotService = inject(PlotService);
  private readonly ownerService = inject(OwnerService);
  showDeactivateModal: boolean = false;
  userToDeactivate: number = 0;

  //Filtros
  selectType = new FormControl("Seleccione un tipo");
  selectState = new FormControl("Seleccione un estado");
  
  plotTypes : string[] = [];
  plotStatus : string[] = [];

  

  constructor(private router: Router,private modal: NgbModal) { }

  ngOnInit() {
    this.plotService.getAllStates().subscribe({
      next: (data: PlotStateModel[]) => {
        this.plotStatus = data.map(state => state.name);
      },
      error: (error) => {
        console.error('Error al cargar los estados:', error);
      }
    });

    this.plotService.getAllTypes().subscribe({
      next: (data: PlotTypeModel[]) =>{
        this.plotTypes = data.map(type => type.name)
      }  ,
      error: (error) => {
        console.error('Error al cargar los tipos:', error);
      }
    });

    this.plotService.getAllPlots().subscribe({
      next: (data: GetPlotModel[]) => {
        this.plots = data;
    
        // Crear un arreglo de promesas para obtener los propietarios
        const ownerPromises = this.plots.map(plot => {
          return this.ownerService.getOwnerByPlotId(plot.id).pipe(
            map(owners => owners[0]?.lastname + ', ' + owners[0]?.name) // Suponiendo que siempre hay un solo propietario
          ).toPromise(); // Convertir el Observable en una Promesa
        });
    
        // Esperar a que todas las promesas se resuelvan
        Promise.all(ownerPromises).then(owners => {
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
              data: this.plots.map((plot, index) => [
                plot.plot_number,
                plot.block_number,
                plot.total_area_in_m2 + ' m²',
                plot.built_area_in_m2 + ' m²',
                this.showPlotType(plot.plot_type),
                this.showPlotState(plot.plot_state),
                owners[index] || 'No disponible', // Agregar el propietario
              ]),
              columns: [
                { title: 'Lote', width: '10%', className: 'text-start' },
                { title: 'Manzana', width: '10%', className: 'text-start' },
                { title: 'Mts.2 terreno', width: '15%', className: 'text-start' },
                { title: 'Mts.2 construidos', width: '15%', className: 'text-start' },
                { title: 'Tipo lote', width: '15%', className: 'text-start' },
                { title: 'Estado', width: '15%', className: 'text-start' },
                { title: 'Propietario', width: '15%', className: 'text-start' }, // Nueva columna
                {
                  title: 'Acciones',
                  orderable: false,
                  width: '15%',
                  className: 'text-left',
                  render: (data, type, row, meta) => {
                    const plotId = this.plots[meta.row].id;
                    return `
                      <div class="dropdown-center d-flex align-items-center">
                        <button class="btn btn-light border border-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item view-plot" data-id="${plotId}">Ver más</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item edit-plot" data-id="${plotId}">Editar</a></li>
                        </ul>
                      </div>
                    `;
                  }
                }
              ],
              dom: '<"mb-3"t>' + '<"d-flex justify-content-between"lp>',
              language: {
                lengthMenu: "_MENU_",
                zeroRecords: "No se encontraron resultados",
                info: "Mostrando página _PAGE_ de _PAGES_",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                search: "Buscar:",
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
            $('#myTable_filter input').bind('input', (event) => {
              const searchValue = (event.target as HTMLInputElement).value;
    
              // Comienza a buscar solo si hay 3 o más caracteres
              if (searchValue.length >= 2) {
                table.search(searchValue).draw();
              } else {
                table.search('').draw();
              }
            });
    
            // Asignar eventos a los botones "Ver más" y "Editar"
            $('#myTable').on('click', '.view-plot', (event) => {
              const plotId = $(event.currentTarget).data('id');
              this.abrirModal(plotId);
            });
    
            $('#myTable').on('click', '.edit-plot', (event) => {
              const plotId = $(event.currentTarget).data('id');
              this.redirectEdit(plotId);
            });
    
          }, 0);
        }).catch(error => {
          console.error('Error al obtener propietarios:', error);
        });
      },
      error: (error) => {
        console.error('Error al cargar los lotes:', error);
      }
    });
  }

  //Filtrat por tipo
  updateFilterType(){
    const table = $('#myTable').DataTable();
    table.column(4).search(this.selectType.value ?? '').draw();
  }
  
  //Filtrar por estado
  updateFilterState() {
    const table = $('#myTable').DataTable();
    table.column(5).search(this.selectState.value ?? '').draw();
  }

  getContentBetweenArrows(input: string): string[] {
    const matches = [...input.matchAll(/>(.*?)</g)];
    return matches.map(match => match[1]).filter(content => content !== "");
  }


  resetFilters() {
    // Reiniciar el valor del control de rol
    this.selectType.setValue('');
    this.selectState.setValue('');

    // Limpiar el campo de búsqueda general y el filtro de la columna de tipo
    const searchInput = document.querySelector('#myTable_filter input') as HTMLInputElement;
    if (searchInput) {
        searchInput.value = ''; // Limpiar el valor del input de búsqueda general
    }

    // Obtener la instancia de DataTable
    const table = $('#myTable').DataTable();

    // Limpiar búsqueda y filtros
    table.search('').draw(); // Limpiar búsqueda general
    table.column(4).search('').draw(); // Limpiar filtro de tipo
    table.column(5).search('').draw(); // Limpiar filtro de tipo
}


   //Exporta a pdf la tabla, si esta filtrada solo exporta los datos filtrados
   exportPdf() {
    const doc = new jsPDF();
  
    // Agregar título centrado
    const title = 'Lista de Lotes';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 20);
  
    // Obtener columnas de la tabla (añadido 'Email')
    const columns = ['Lote', 'Manzana', 'M2', 'M2 Construidos','Tipo','Estado'];
  
    // Filtrar datos visibles en la tabla
    const table = $('#myTable').DataTable(); // Inicializa DataTable una vez
  
    // Cambia la forma de obtener las filas visibles usando 'search' en lugar de 'filter'
    const visibleRows = table.rows({ search: 'applied' }).data().toArray(); // Usar 'search: applied'
  
    // Mapear los datos filtrados a un formato adecuado para jsPDF
    const rows = visibleRows.map((row: any) => [
      `${row[0]}`,       
      `${row[1]}`,       
      `${row[2]}`,       
      `${row[3]}`,
      `${this.getContentBetweenArrows(row[4])}`,
      `${this.getContentBetweenArrows(row[5])}`,
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
        0: { cellWidth: 30 }, 
        1: { cellWidth: 30 }, 
        2: { cellWidth: 30 }, 
        3: { cellWidth: 30 }, 
        4: { cellWidth: 40 },
        5: { cellWidth: 40 }
      }, // Ajusta el ancho de las columnas
    });
  
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replace(/-/g, '_'); 
    const fileName = `${formattedDate}_LOTES.pdf`; 
  
    doc.save(fileName); 
  }

  //Exporta por excel los registros de la tabla
  exportExcel() {

    const table = $('#myTable').DataTable(); // Inicializa DataTable una vez
  
    // Cambia la forma de obtener las filas visibles usando 'search' en lugar de 'filter'
    const visibleRows = table.rows({ search: 'applied' }).data().toArray(); // Usar 'search: applied'

    // Filtrar a los lotes x aquellos que aparzcan en la tabla visibleRows
    let plots = this.plots.filter(plot => visibleRows.some(row => row[0] === plot.plot_number));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(plots.map(plot => ({
      Lote: plot.plot_number,
      Manzana: plot.block_number,
      M2: plot.total_area_in_m2,
      M2_Construidos: plot.built_area_in_m2,
      Tipo: plot.plot_type,
      Estado: plot.plot_state 
    })));
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lotes');
  
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replace(/-/g, '_');
    const fileName = `${formattedDate}_LOTES.xlsx`; 
  
    XLSX.writeFile(wb, fileName);
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
    this.router.navigate(['/home/plots/edit', id])
  }

  // Busca el user y se lo pasa al modal
  plotModel: GetPlotModel = new GetPlotModel();
   selectUser(id: number): Promise<GetPlotModel> {
       // Mostrar SweetAlert de tipo 'cargando'
     return new Promise((resolve, reject) => {
       this.plotService.getPlotById(id).subscribe({
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

  showPlotType(plotType : any) : string {

    let color : string = ''
   
      switch (plotType) {
        case "Comercial":
          color = "secondary";
          break;
        case "Residencial":
          color = "success";
          break;
        case "Baldío":
          color = "danger";
          break;
      }

      return `<button class='btn btn-${color} rounded-pill m-1'>${plotType}</button>`;
  }

  showPlotState(plotState : any) : string {

    let color : string = ''
   
      switch (plotState) {
        case "Disponible":
          color = "success";
          break;
        case "Habitado":
          color = "secondary";
          break;
        case "En construcción":
          color = "danger";
          break;
      }

      return `<button class='btn btn-${color} rounded-pill m-1'>${plotState}</button>`;
  }
}
