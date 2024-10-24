import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PlotService } from '../../../users-servicies/plot.service';
import { PlotTypeModel } from '../../../users-models/plot/PlotType';
import { PlotStateModel } from '../../../users-models/plot/PlotState';
import { PlotModel } from '../../../users-models/plot/Plot';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPlotModel } from '../../../users-models/plot/GetPlot';
import { PutPlot } from '../../../users-models/plot/PutPlot';

@Component({
  selector: 'app-users-update-plot',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-update-plot.component.html',
  styleUrl: './users-update-plot.component.css'
})
export class UsersUpdatePlotComponent implements OnInit {

  private readonly plotService = inject(PlotService);

  types: PlotTypeModel[] = [];
  states: PlotStateModel[] = [];

  constructor(private router: Router, private route: ActivatedRoute){ }

  formReactivo = new FormGroup({
    plotNumber: new FormControl(0, [Validators.required]),
    blockNumber: new FormControl(0, [Validators.required]),
    totalArea: new FormControl(0, [Validators.required]),
    totalBuild: new FormControl(0, [Validators.required]),
    state: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required])
  })

  ngOnInit(): void {

    var id = Number(this.route.snapshot.paramMap.get('id')) || 0;
  
    this.formReactivo.get('plotNumber')?.disable();
    this.formReactivo.get('blockNumber')?.disable();
  
    // Obtener el lote por su ID
    this.plotService.getPlotById(id).subscribe({
      next: (response) => {
        console.log(response);
  
        // Cargar los valores en el formulario
        this.formReactivo.get('plotNumber')?.setValue(response.plot_number);
        this.formReactivo.get('blockNumber')?.setValue(response.block_number);
        this.formReactivo.get('totalArea')?.setValue(response.total_area_in_m2);
        this.formReactivo.get('totalBuild')?.setValue(response.built_area_in_m2);
  
        // Guardar el valor del nombre del estado y tipo para luego asignar el ID
        const plotStateName = response.plot_state;
        const plotTypeName = response.plot_type;
  
        // Después de cargar los tipos y estados, encontrar el ID correcto
        this.plotService.getAllTypes().subscribe({
          next: (data) => {
            this.types = data;
            // Encontrar el ID del tipo por el nombre
            const plotType = this.types.find(t => t.name === plotTypeName);
            if (plotType) {
              this.formReactivo.get('type')?.setValue(plotType.id.toString());
            }
          },
          error: (error) => {
            console.error('Error al obtener los tipos de lote:', error);
            alert("Error al obtener los tipos de lote!");
          }
        });
  
        this.plotService.getAllStates().subscribe({
          next: (data) => {
            this.states = data;
            // Encontrar el ID del estado por el nombre
            const plotState = this.states.find(s => s.name === plotStateName);
            if (plotState) {
              this.formReactivo.get('state')?.setValue(plotState.id.toString());
            }
          },
          error: (error) => {
            console.error('Error al obtener los estados de lote:', error);
            alert("Error al obtener los estados de lote!");
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener el lote:', error);
        alert("Error al obtener el lote!");
      }
    });
  }
  
  

  updatePlot(){
    var id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    const plot: PutPlot = {
      total_area_in_m2: this.formReactivo.get('totalArea')?.value || 0,
      built_area_in_m2: this.formReactivo.get('totalBuild')?.value || 0,
      plot_state_id: Number(this.formReactivo.get('state')?.value) || 0,
      plot_type_id: Number(this.formReactivo.get('type')?.value) || 0,
      userUpdateId: 1
    }

    console.log(plot);
    

    this.plotService.putPlot(id, plot).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: "Lote actualizado!",
          showConfirmButton: false,
          timer: 1500
        });
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al actualizar el lote:', error);
        alert("Error al actualizar el lote!");
      }
    });
  }

}
