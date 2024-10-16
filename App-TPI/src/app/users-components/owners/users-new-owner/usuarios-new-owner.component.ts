import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerService } from '../../../users-servicies/owner.service';
import { OwnerTypeModel } from '../../../users-models/OwnerType';
import { OwnerStateModel } from '../../../users-models/OwnerState';
import { ApiServiceService } from '../../../users-servicies/api-service.service';
import { RolModel } from '../../../users-models/Rol';
import { UsersSelectMultipleComponent } from '../../utils/users-select-multiple/users-select-multiple.component';
import { PlotModel } from '../../../users-models/Plot';
import { PlotService } from '../../../users-servicies/plot.service';
import { GetPlotDto } from '../../../users-models/GetPlotDto';

@Component({
  selector: 'app-usuarios-new-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UsersSelectMultipleComponent],
  templateUrl: './usuarios-new-owner.component.html',
  styleUrl: './usuarios-new-owner.component.css'
})
export class UsuariosNewOwnerComponent {

  private readonly ownerService = inject(OwnerService);
  private readonly apiService = inject(ApiServiceService);
  private readonly plotService = inject(PlotService);

  types: OwnerTypeModel[] = [];
  states: OwnerStateModel[] = [];
  lotes: GetPlotDto[] = [];
  rolesSelected : string[] = [];

  formReactivo = new FormGroup({
    name: new FormControl("", [Validators.required]),
    lastname: new FormControl("", [Validators.required]),
    dni: new FormControl("", [Validators.required]),
    cuit_cuil: new FormControl("", [Validators.required]),
    birthdate: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    rol: new FormControl(""),
    lote: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    nombreNegocio: new FormControl('')
  });

  ngOnInit(): void {

    this.loadRoles();

    this.ownerService.getAllTypes().subscribe({
      next: (data: OwnerTypeModel[]) => {
        this.types = data;
      },
      error: (err) => {
        console.error('Error al cargar los tipos de lote:', err);
      }
    });

    this.ownerService.getAllStates().subscribe({
      next: (data: OwnerStateModel[]) => {
        this.states = data;
      },
      error: (err) => {
        console.error('Error al cargar los estados de lote:', err);
      }
    });

    this.plotService.getAllPlots().subscribe({
      next: (data: GetPlotDto[]) => {
        this.lotes = data;
      },
      error: (err) => {
        console.error('Error al cargar los tipos de lote:', err);
      }
    });
  }

  roles: RolModel[] = [];

  rolesHtmlString: string = '';  //
  rolesString: string = "Roles añadidos:";
  rolesInput: string[] = [];
  select: string = "";

  loadRoles() {
    this.apiService.getAllRoles().subscribe({
      next: (data: RolModel[]) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      }
    });
  }

  aniadirRol() {
    console.log(this.formReactivo.errors);
    
    const rolSeleccionado = this.formReactivo.get('rol')?.value;
    if (rolSeleccionado && !this.rolesInput.includes(rolSeleccionado)) {  
      this.rolesInput.push(rolSeleccionado);  
    }
    this.formReactivo.get('rol')?.setValue('');
  }

  quitarRol(rol: string) {
    const index = this.rolesInput.indexOf(rol);
    if (index > -1) {
      this.rolesInput.splice(index, 1);
    }
  }

  createOwner() {
    console.log(this.formReactivo.value);
  }
}
