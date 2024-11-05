import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
import { Route, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FileUploadComponent } from '../../utils/file-upload/file-upload.component';
import { ValidatorsService } from '../../../users-servicies/validators.service';
import { AuthService } from '../../../users-servicies/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-usuarios-new-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UsersSelectMultipleComponent, FileUploadComponent, NgSelectModule, FormsModule, CommonModule],
  templateUrl: './usuarios-new-owner.component.html',
  styleUrls: ['./usuarios-new-owner.component.css'] // Asegúrate de que sea styleUrls en lugar de styleUrl
})


export class UsuariosNewOwnerComponent {

  private readonly ownerService = inject(OwnerService);
  private readonly apiService = inject(UserService);
  private readonly plotService = inject(PlotService);
  private readonly validatorService = inject(ValidatorsService);

  //Obtener el id del usuario logueado
  private readonly authService = inject(AuthService);

  JURIDICA_ID = 2;

  types: OwnerTypeModel[] = [];
  states: OwnerStateModel[] = [];

  //Lotes disponibles (cargan el select)
  availablePlots: any[] = [];

  //Roles seleccionados
  rolesSelected: string[] = [];

  //Lotes seleccionados
  plotsSelected : any[] = [];

  passwordVisible: boolean = false;
  files: File[] = [];

  constructor(private router: Router) { }

  formReactivo = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]),
    dni: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^\d+$/)
    ],
      this.validatorService.validateUniqueDni()
    ), //Tipo de documento
    documentType: new FormControl("", [
      Validators.required]),
    birthdate: new FormControl(null, [
      Validators.required,
      this.dateLessThanTodayValidator()]),
    email: new FormControl("", [
      Validators.required,
      Validators.email
    ],
      this.validatorService.validateUniqueEmail()
  ),
    state: new FormControl("", [
      Validators.required]),
    type: new FormControl("", [
      Validators.required]),
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30)
    ],
      this.validatorService.validateUniqueUsername()
    ),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)]),
    rol: new FormControl(""),
    plot: new FormControl(null, [
      Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(20),
      Validators.pattern(/^\d+$/)]),
    //phone: new FormControl('', [Validators.required]),
    company: new FormControl({ value: "", disabled: true }),
    telegram_id: new FormControl('')
    
  });

  ngOnInit(): void {
    this.loadRoles();

    const typeControl = this.formReactivo.get('type');
    if (typeControl) {
      typeControl.valueChanges.subscribe(value => {
        this.toggleCompanyField(String(value ?? ""));
      });
    }

    this.ownerService.getAllTypes().subscribe({
      next: (data: OwnerTypeModel[]) => {
        this.types = data;
      },
      error: (err) => { //ver
        console.error('Error al cargar los tipos de propietario:', err);
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

        //Se filtran los datos y se agregan como un objeto clave : valor para que puedan ser renderizados en el selectmultiple
        let dataFiltered : any[] = [];
        data.forEach(d => dataFiltered.push({value: d.id, name: `Numero de lote: ${d.plot_number} - Manzana:${d.block_number }`}))
        this.availablePlots = dataFiltered;
      },
      error: (err) => {
        console.error('Error al cargar los lotes:', err);
      }
    });

    this.formReactivo.get('type')?.setValue("");
    this.formReactivo.get('state')?.setValue("");
  }

  roles: RolModel[] = [];
  rolesInput: string[] = [];
  select: string = "";

  onPlotChange(selectedPlots: any[]) {
    this.plotsSelected = [...selectedPlots.values()];
    console.log(selectedPlots); // Verifica los valores seleccionados
  }

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

  dateLessThanTodayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today ? { dateTooHigh: true } : null;
    }
  }

  private toggleCompanyField(ownerType: string) {
    if (ownerType === this.JURIDICA_ID.toString()) {
      this.formReactivo.get('company')?.enable();
    } else {
      this.formReactivo.get('company')?.disable();
      this.formReactivo.get('company')?.setValue(""); // Limpiar el campo si se deshabilita
    }
  }

  // formatCUIT(value: string): void {
  //   const cleaned = value.replace(/\D/g, ''); // Eliminar caracteres no numéricos

  //   if (cleaned.length < 2) {
  //     this.formReactivo.get('cuit_cuil')?.setValue(cleaned);
  //     return;
  //   }

  //   let formatted = cleaned;
  //   if (cleaned.length >= 2) {
  //     formatted = cleaned.substring(0, 2) + '-'; // Agrega guión después de los primeros 2 dígitos
  //   }
  //   if (cleaned.length > 2) {
  //     formatted += cleaned.substring(2);
  //   }
  //   if (cleaned.length >= 10) {
  //     formatted = formatted.substring(0, 11) + '-' + cleaned.charAt(10); // Agrega guión antes del último dígito
  //   }

  //   this.formReactivo.get('cuit_cuil')?.setValue(formatted, { emitEvent: false }); // Evita el loop de eventos
  // }

  confirmExit() {
    Swal.fire({
        title: '¿Seguro que desea cancelar la operación?',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            this.formReactivo.reset(); 
            this.redirect('/home/owners/list'); 

            Swal.fire({
                title: 'Operación cancelada',
                icon: 'info',
                showConfirmButton: false, 
                timer: 1000 
            });
        }
    });
  }
  
  redirect(path: string) {
    this.router.navigate([path]);
  }
  
  addRole() {
    const rolSeleccionado = this.formReactivo.get('rol')?.value;
    if (rolSeleccionado && !this.rolesInput.includes(rolSeleccionado)) {
      this.rolesInput.push(rolSeleccionado);
    }
    this.formReactivo.get('rol')?.setValue('');
  }

  //Cambiar visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  quitRole(rol: string) {
    const index = this.rolesInput.indexOf(rol);
    if (index > -1) {
      this.rolesInput.splice(index, 1);
    }
  }

  onValidate(controlName: string) {
    const control = this.formReactivo.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid
    }
  }

  showError(controlName: string): string {
    const control = this.formReactivo.get(controlName);
  
    if (!control || !control.errors) return '';
  
    const errorKey = Object.keys(control.errors)[0]; 
    const errorMessages: { [key: string]: string } = {
      required: 'Este campo no puede estar vacío.',
      email: 'Formato de correo electrónico inválido.',
      minlength: `El valor ingresado es demasiado corto. Mínimo ${control.errors['minlength']?.requiredLength} caracteres.`,
      maxlength: `El valor ingresado es demasiado largo. Máximo ${control.errors['maxlength']?.requiredLength} caracteres.`,
      pattern: 'El formato ingresado no es válido.',
      min: `El valor es menor que el mínimo permitido (${control.errors['min']?.min}).`,
      max: `El valor es mayor que el máximo permitido (${control.errors['max']?.max}).`,
      requiredTrue: 'Debe aceptar el campo requerido para continuar.',
      dateLessThanToday: 'La fecha ingresada debe ser anterior al día de hoy.',
      url: 'El formato de URL ingresado no es válido.',
      number: 'Este campo solo acepta números.',
      customError: 'Error personalizado: verifique el dato ingresado.',
      usernameTaken: 'El nombre de usuario ya está en uso.',
      emailTaken: 'El correo electrónico ya está en uso.',
      dniTaken: 'El DNI ya está en uso.',
    };
  
    return errorMessages[errorKey] || 'Error no identificado en el campo.';
  }

  getFiles(files: File[]) {
    this.files = files;
  }

  createOwner() {
    const owner: OwnerModel = {
      name: this.formReactivo.get('name')?.value || '',
      lastname: this.formReactivo.get('lastname')?.value || '',
      dni: this.formReactivo.get('dni')?.value || '',
      dni_type: this.formReactivo.get('documentType')?.value || '', //Tipo de documento
      dateBirth: this.formReactivo.get('birthdate')?.value || new Date(),
      ownerTypeId: Number(this.formReactivo.get('type')?.value || ""),
      taxStatusId:  Number(this.formReactivo.get('state')?.value || ""),
      active: true,
      username: this.formReactivo.get('username')?.value || '',
      password: this.formReactivo.get('password')?.value || '',
      email: this.formReactivo.get('email')?.value || '',
      phoneNumber: this.formReactivo.get('phone')?.value || '',
      avatarUrl: '',
      businessName: this.formReactivo.get('company')?.value || '',
      telegramId: Number(this.formReactivo.get('telegram_id')?.value) || 0,

      //--------------------------------------------------VER-----------------------------------------------------------------------------------------------------------------------
     /* estos estan hardcodeado para que ande*/
      roles: ["Propietario"],//this.rolesSelected,

      //Id del usuario logueado
      userCreateId: this.authService.getUser().id,

      //Lista de ids de los lotes seleccionados
      plotId: this.plotsSelected,

      //Archivos seleccionados
      files: this.files
    };

    var plotsIds: number[] = [];
    this.plotsSelected.forEach((plot: any) => {
      plotsIds.push(plot.value);
    });

    owner.plotId = plotsIds;

    console.log(owner);
    

    //Se intenta crear el propietario
    this.ownerService.postOwner(owner).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: "Propietario guardado",
          showConfirmButton: false,
          timer: 1460
        });

        //Resetea el fomulario
        this.resetForm() 
      },

      //Se intercepta el error, si sucede
      error: (error) => {
        console.error('Error al guardar el propietario:', error);
        Swal.fire({
          icon: "error",
          title: "Error al guardar los cambios",
          showConfirmButton: false,
          timer: 1460
        });
      }
    });
  }


  //Evento para actualizar el listado de files a los seleccionados actualmente
  onFileChange(event: any) {
    this.files.push(...Array.from(event.target.files as FileList)); //Convertir FileList a Array
  }

  //Eliminar archivo
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  //Resetear el formulario
  resetForm(){
    this.formReactivo.reset();
    this.clearFileInput();
  }

  //Limpiar los archivos
  clearFileInput() {
    this.files = [];

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
