import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerService } from '../../../users-servicies/owner.service';
import { OwnerTypeModel } from '../../../users-models/owner/OwnerType';
import { OwnerStateModel } from '../../../users-models/owner/OwnerState';
import { UserService } from '../../../users-servicies/user.service';
import { RolModel } from '../../../users-models/users/Rol';
import { UsersSelectMultipleComponent } from '../../utils/users-select-multiple/users-select-multiple.component';
import { PlotService } from '../../../users-servicies/plot.service';
import { GetPlotDto } from '../../../users-models/plot/GetPlotDto';
import { OwnerModel } from '../../../users-models/owner/PostOwnerDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-new-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UsersSelectMultipleComponent],
  templateUrl: './usuarios-new-owner.component.html',
  styleUrl: './usuarios-new-owner.component.css'
})
export class UsuariosNewOwnerComponent {

  private readonly ownerService = inject(OwnerService);
  private readonly apiService = inject(UserService);
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
    birthdate: new FormControl(null, [Validators.required]),
    email: new FormControl("", [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    rol: new FormControl(""),
    lote: new FormControl(null, [Validators.required]),
    phone: new FormControl('', [Validators.required]),
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

    //SOLO MUESTRA LOS LOTES DISPONIBLES
    this.plotService.getAllPlotsAvailables().subscribe({
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
    const owner: OwnerModel = {
      name: this.formReactivo.get('name')?.value || '',
      lastname: this.formReactivo.get('lastname')?.value || '',
      dni: this.formReactivo.get('dni')?.value || '',
      cuitCuil: this.formReactivo.get('cuit_cuil')?.value || '',
      dateBirth: this.formReactivo.get('birthdate')?.value || new Date(),
      ownerTypeId: this.formReactivo.get('type')?.value || 0,
      taxStatusId: this.formReactivo.get('state')?.value || 0,
      active: true,
      username: this.formReactivo.get('username')?.value || '',
      password: this.formReactivo.get('password')?.value || '',
      email: this.formReactivo.get('email')?.value || '',
      phoneNumber: this.formReactivo.get('phone')?.value || '',
      avatarUrl: 'nada',
      roles: this.rolesSelected,
      userCreateId: 1,
      plotId: this.formReactivo.get('lote')?.value || 0,
      telegramId: 0
    }

    console.log(owner);
    

    this.ownerService.postOwner(owner).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: "Propietario guardado",
          showConfirmButton: false,
          timer: 1460
        });
      },
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error al guardar los cambios",
          showConfirmButton: false,
          timer: 1460
        });
      }
    });
  }
}