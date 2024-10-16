import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PlotService } from '../../../users-servicies/plot.service';
import { PlotTypeModel } from '../../../users-models/PlotType';
import { PlotStateModel } from '../../../users-models/PlotState';
import { PlotModel } from '../../../users-models/Plot';

@Component({
  selector: 'app-users-new-plot',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-new-plot.component.html',
  styleUrl: './users-new-plot.component.css'
})
export class UsersNewPlotComponent {

  showOwners : boolean = false;

  toggleShowOwners(event: any): void {
    this.showOwners = event.target.checked;
  }

  private readonly plotService = inject(PlotService);

  types: PlotTypeModel[] = [];
  states: PlotStateModel[] = [];
   
  formReactivo = new FormGroup({
    plotNumber: new FormControl(0, [Validators.required]),
    blockNumber: new FormControl(0, [Validators.required]),
    totalArea: new FormControl(0, [Validators.required]),
    totalBuild: new FormControl(0, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required])
  })

  resetForm() {
    this.formReactivo.reset();
    this.states = [];
    this.types = [];
  }

  ngOnInit(): void {

    this.plotService.getAllTypes().subscribe({
      next: (data: PlotTypeModel[]) => {
        this.types = data;
      },
      error: (err) => {
        console.error('Error al cargar los tipos de lote:', err);
      }
    });

    this.plotService.getAllStates().subscribe({
      next: (data: PlotStateModel[]) => {
        this.states = data;
      },
      error: (err) => {
        console.error('Error al cargar los estados de lote:', err);
      }
    });
  }

  createPlot(){
    const plot: PlotModel = {
      plot_number: this.formReactivo.get('plotNumber')?.value || 0,
      block_number: this.formReactivo.get('blockNumber')?.value || 0,
      total_area_in_m2: this.formReactivo.get('totalArea')?.value || 0,
      built_area_in_m2: this.formReactivo.get('totalBuild')?.value || 0,
      plot_state_id: this.formReactivo.get('state')?.value || 0,
      plot_type_id: this.formReactivo.get('type')?.value || 0
    }

    this.plotService.postPlot(plot).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: "Lote guardado",
          showConfirmButton: false,
          timer: 1500
        });
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear el lote:', error);
        alert("Error al crear la canción!");
      }
    });
  }
}