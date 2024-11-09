import { CommonModule, formatDate } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { RolModel } from '../../../users-models/users/Rol';
import { UserGet } from '../../../users-models/users/UserGet';
import { UserPut } from '../../../users-models/users/UserPut';
import { data } from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from '../../utils/users-login/login.component';
import { DateService } from '../../../users-servicies/date.service';
import { AuthService } from '../../../users-servicies/auth.service';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject } from 'rxjs';
import { UsersMultipleSelectComponent } from '../../utils/users-multiple-select/users-multiple-select.component';

@Component({
  selector: 'app-users-update-user',
  standalone: true,
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule, UsersMultipleSelectComponent],
  templateUrl: './users-update-user.component.html',
  styleUrl: './users-update-user.component.css'
})
export class UsersUpdateUserComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
  @ViewChild(UsersMultipleSelectComponent) rolesComponent!: UsersMultipleSelectComponent;

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  rolesInput: string[] = [];
  id: string = '';
  checkRole: boolean = false;
  optionsForOwner: string[] = ["Familiar mayor", "Familiar menor"];
  rolesUser: string[] = ["Familiar mayor"];
  rolesSelected: any[] = [];
  existingRoles: any[] = [];

  opt: any[] = [];
  checkedOpt: string[] = [];


  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || ''; // Obtiene el parámetro 'id'

    this.getAllRoles();

    this.loadUserData();


    // Desactiva campos específicos del formulario
    this.updateForm.get('dni')?.disable();
    this.updateForm.get('email')?.disable();
    this.updateForm.get('avatar_url')?.disable();
    this.updateForm.get('datebirth')?.disable();


    this.loadSelect()
  }

  loadSelect(){
    this.opt = this.existingRoles;
    this.checkedOpt = this.rolesUser;
  }

  getAllRoles(){
    this.userService.getAllRoles().subscribe({
      next: (data: RolModel[]) => {
        this.existingRoles = data.map(rol => rol.description);
        if (this.authService.getActualRole() == "Propietario") {
          let optionsFilter = this.existingRoles.filter(rol => this.optionsForOwner.includes(rol));
          this.existingRoles = [];
          optionsFilter.forEach(o => this.existingRoles.push({ value: o, name: o }))

          console.log("Test getAll 1:")
          console.log(this.existingRoles)


        } else {
          let optionsFilter = this.existingRoles.filter(rol => !this.optionsForOwner.includes(rol) && rol != "Propietario" && rol != "SuperAdmin");
          this.existingRoles = [];
          optionsFilter.forEach(o => this.existingRoles.push({ value: o, name: o }))

          console.log("Test getAll 2:")
          console.log(this.existingRoles)
        }

      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      }
    });
  }


  loadUserData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userService.getUserById(parseInt(this.id)).subscribe({
        next: (data: UserGet) => {
          console.log(data);
          
          this.updateForm.get('name')?.setValue(data.name);
          this.updateForm.get('lastname')?.setValue(data.lastname);
          this.updateForm.get('dni')?.setValue(data.dni.toString());
          this.updateForm.get('email')?.setValue(data.email);
          this.updateForm.get('avatar_url')?.setValue(data.avatar_url);
          const formattedDate = DateService.parseDateString(data.datebirth);

          if (formattedDate) {
            // Formatea la fecha a 'yyyy-MM-dd' para un input de tipo date
            const formattedDateString = formattedDate.toISOString().split('T')[0];

            this.updateForm.patchValue({
              datebirth: formattedDateString
            });
          } else {
            this.updateForm.patchValue({
              datebirth: ''
            });
          }

          this.updateForm.get('phoneNumber')?.setValue(data.phone_number.toString());
          this.updateForm.get('telegram_id')?.setValue(data.telegram_id) || 0;

          // Asigna `rolesSelected` después de obtener `data.roles`
          this.rolesUser = [...data.roles];  // Copia los roles para que aparezcan seleccionados en el select
          console.log("Pre-checked:")
          console.log(this.rolesUser);
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
          reject(error); // Rechaza la Promesa si hay un error
        }
      });
    });
  }

  //-----------------------------------------------------------------------------

  //Crea el formulario con sus controles
  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(20)]),
    telegram_id: new FormControl(0),
    dni: new FormControl(''),
    email: new FormControl(''),
    avatar_url: new FormControl(''),
    datebirth: new FormControl(''),
    roles: new FormControl([])
  });

  //Añade los roles seleccionados por users-select-multiple
  fillRolesSelected(roles: string[]) {
    // Filtra roles únicos para evitar duplicados
    this.rolesSelected = roles.filter((role, index) => roles.indexOf(role) === index);
    console.log('Roles seleccionados:', this.rolesSelected);
  }

  confirmExit() {
    if (this.authService.getActualRole() === 'Propietario') {
      this.router.navigate(['home/family']);
    } else if (this.authService.getActualRole() === 'Gerente') {
      this.router.navigate(['home/users/list']);
    }
  }

  //Actualiza el usuario
  updateUser() {
    const user: UserPut = new UserPut();
    user.name = this.updateForm.get('name')?.value || '';
    user.lastName = this.updateForm.get('lastname')?.value || '';
    user.dni = this.updateForm.get('dni')?.value || '';
    user.phoneNumber = this.updateForm.get('phoneNumber')?.value?.toString() || '';
    user.email = this.updateForm.get('email')?.value || '';
    user.avatar_url = this.updateForm.get('avatar_url')?.value || '';

    //Formatea la fecha correctamente (año-mes-día)
    const date: Date = new Date(this.updateForm.get('datebirth')?.value || '');

    console.log(date);
    

    //Formatear la fecha como YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;


    console.log(formattedDate);
    

    user.datebirth = formattedDate;
    user.roles = this.rolesSelected || []; // Asegúrate de que roles sea un arreglo   
    user.userUpdateId = this.authService.getUser().id;
    user.dni_type_id = 1;

    //Llama al servicio para actualizar el usuario
    this.userService.putUser(user, parseInt(this.id)).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: 'Usuario actualizado exitosamente',
          timer: 1000,
          showConfirmButton: false
        });
        this.redirectList();
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
        // Manejo de errores
      },
    });
  }

  toggleSelection(item: any) {
    const index = this.rolesSelected.indexOf(item.value);
    if (index > -1) {
      // Si ya está seleccionado, lo desmarcamos
      this.rolesSelected.splice(index, 1);
    } else {
      // Si no está seleccionado, lo agregamos
      this.rolesSelected.push(item.value);
    }
  }


  //Redirige a la lista
  redirectList() {
    if (this.authService.getActualRole() == 'Propietario') {
      this.router.navigate(['home/family']);
    }
    else if (this.authService.getActualRole() == 'Gerente') {
      this.router.navigate(['home/users/list']);
    }
  }

  //Retorna una clase para poner el input en verde o rojo dependiendo si esta validado
  onValidate(controlName: string) {
    const control = this.updateForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid
    }
  }

  updateRoles(newRoles: any) {
    this.updateForm.patchValue({
      roles: newRoles
    })
    console.log(this.updateForm.value);
  }

  mostrarRolesSeleccionados() {
    alert(this.rolesSelected)
  }

  showError(controlName: string): string {
    const control = this.updateForm.get(controlName);

    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];

      switch (errorKey) {
        case 'required':
          return 'Este campo no puede estar vacío.';
        case 'email':
          return 'Formato de correo electrónico inválido.';
        case 'minlength':
          return `El valor ingresado es demasiado corto. Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `El valor ingresado es demasiado largo. Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
        case 'min':
          return `El valor es menor que el mínimo permitido (${control.errors['min'].min}).`;
        case 'pattern':
          return 'El formato ingresado no es válido.';
        case 'requiredTrue':
          return 'Debe aceptar el campo requerido para continuar.';
        case 'date':
          return 'La fecha ingresada es inválida.';
        default:
          return 'Error no identificado en el campo.';
      }
    }
    return ''; // Retorna cadena vacía si no hay errores.
  }
}

