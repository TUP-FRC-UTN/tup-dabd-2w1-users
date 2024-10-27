import { CommonModule, formatDate } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { RolModel } from '../../../users-models/users/Rol';
import { UserGet } from '../../../users-models/users/UserGet';
import { UserPut } from '../../../users-models/users/UserPut';
import { data } from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersSelectMultipleComponent } from '../../utils/users-select-multiple/users-select-multiple.component';
import { LoginComponent } from '../../utils/users-login/login.component';
import { DateService } from '../../../users-servicies/date.service';
import { AuthService } from '../../../users-servicies/auth.service';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-users-update-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, UsersSelectMultipleComponent],
  templateUrl: './users-update-user.component.html',
  styleUrl: './users-update-user.component.css'
})
export class UsersUpdateUserComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute){ }
  @ViewChild(UsersSelectMultipleComponent) rolesComponent!: UsersSelectMultipleComponent;
  
  private readonly apiService = inject(UserService);
  private readonly authService = inject(AuthService);
  roles: RolModel[] = [];

  rolesInput: string[] = [];
  id: string = '';
  checkRole: boolean = false;


  
  rolesSelected : string[] = [];
  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || ''; // Obtiene el parámetro 'id'
  
    this.apiService.getUserById(parseInt(this.id)).subscribe({
      next: (data: UserGet) => {
        this.updateForm.get('name')?.setValue(data.name);
        this.updateForm.get('lastname')?.setValue(data.lastname);
        this.updateForm.get('dni')?.setValue(data.dni.toString());
        this.updateForm.get('email')?.setValue(data.email);
        this.updateForm.get('avatar_url')?.setValue(data.avatar_url);
        const formattedDate = DateService.parseDateString(data.datebirth);
        this.updateForm.patchValue({
          datebirth: formattedDate ? DateService.formatDate(formattedDate) : ''
        });
        this.updateForm.get('phoneNumber')?.setValue(data.phone_number.toString());
        this.updateForm.get('telegram_id')?.setValue(data.telegram_id) || 0;
  
        // Asigna `rolesSelected` después de obtener `data.roles`
        this.rolesSelected = data.roles || [];
        console.log('Roles:', this.rolesSelected);
        this.rolesComponent.updateRoles(this.rolesSelected);
        
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    });
  
    // Desactiva campos específicos del formulario
    this.updateForm.get('dni')?.disable();
    this.updateForm.get('email')?.disable();
    this.updateForm.get('avatar_url')?.disable();
    this.updateForm.get('datebirth')?.disable();
  }

  //Crea el formulario con sus controles
  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
    telegram_id: new FormControl(0),
    dni: new FormControl(''),
    email: new FormControl(''),
    avatar_url: new FormControl(''),
    datebirth: new FormControl(''),
    roles: new FormControl('')
  });

  //Añade los roles seleccionados por users-select-multiple
  fillRolesSelected(roles: any) {
    this.rolesSelected = roles;  //Asignamos directamente los roles emitidos
  }

  confirmExit() {
    Swal.fire({
      title: '¿Seguro que desea cancelar la operación?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['home/users/list']);
        Swal.fire('Operación cancelada', '', 'info');
      }
    });
  }

  //Verifica que haya algún rol chequeado
  verifyRole() {
    if(this.rolesSelected.length === 0){  
      this.checkRole = false;
    }
    else{
      this.checkRole = true;
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

    //Formatear la fecha como YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    user.datebirth = formattedDate;
    user.roles = this.rolesSelected || []; // Asegúrate de que roles sea un arreglo   
    user.userUpdateId = this.authService.getUser().id;
    user.dni_type_id = 1;
    
    //Llama al servicio para actualizar el usuario
    this.apiService.putUser(user, parseInt(this.id)).subscribe({
        next: (response) => {
            Swal.fire({
              icon: "success",
              title: 'Usuario actualizado exitosamente',
              showConfirmButton: false
            });
            if(this.authService.getActualRole() === 'Owner'){
              this.router.navigate(['home/family']);
            }
            else if(this.authService.getActualRole() == 'Admin'){
              this.router.navigate(['home/users/list']);
            }
        },
        error: (error) => {
            console.error('Error al actualizar el usuario:', error);
            // Manejo de errores
        },
    });
  }

  //Redirige a la lista
  redirectList() {
    if(this.authService.getActualRole() === 'Owner'){
      this.router.navigate(['home/family']);
    }
    else if(this.authService.getActualRole() == 'Admin'){
      this.router.navigate(['home/users/list']);
    }
  }
}

