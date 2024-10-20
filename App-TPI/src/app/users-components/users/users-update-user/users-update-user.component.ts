import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { RolModel } from '../../../users-models/users/Rol';
import { UserGet } from '../../../users-models/users/UserGet';
import { UserPut } from '../../../users-models/users/UserPut';
import { data } from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersSelectMultipleComponent } from '../../utils/users-select-multiple/users-select-multiple.component';
import { LoginComponent } from '../../utils/users-login/login.component';

@Component({
  selector: 'app-users-update-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, UsersSelectMultipleComponent],
  templateUrl: './users-update-user.component.html',
  styleUrl: './users-update-user.component.css'
})
export class UsersUpdateUserComponent implements OnInit {

  
  private readonly apiService = inject(UserService);
  constructor(private router: Router, private route: ActivatedRoute){ }
  rolChanger: string = 'Admin';

  rolesSelected : string[] = [];
    
  roles: RolModel[] = [];
  rolesInput: string[] = [];
  id: string = '';

  changesRol(rol: string) {
    this.rolChanger = rol;

  }

  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    avatar_url: new FormControl('', [Validators.required]),
    datebirth: new FormControl('', [Validators.required]),
    roles: new FormControl('') 
  });


  updateUser() {
    const user: UserPut = new UserPut();
    user.name = this.updateForm.get('name')?.value || '';
    user.lastName = this.updateForm.get('lastname')?.value || '';
    user.dni = this.updateForm.get('dni')?.value || '';
    user.phoneNumber = this.updateForm.get('phoneNumber')?.value?.toString() || '';
    user.email = this.updateForm.get('email')?.value || '';
    user.avatar_url = this.updateForm.get('avatar_url')?.value || '';

    // Formatea la fecha correctamente (año-mes-día)
    const date: Date = new Date(this.updateForm.get('datebirth')?.value || '');

// Formatear la fecha como YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    user.datebirth = formattedDate;
    user.roles = this.rolesSelected || []; // Asegúrate de que roles sea un arreglo   
    
    
    console.log("aaaaaa" + this.rolesSelected);
    

    // Llama al servicio para actualizar el usuario
    this.apiService.putUser(user, parseInt(this.id)).subscribe({
        next: (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            alert('Usuario actualizado exitosamente');
            if(this.rolChanger == 'Owner'){
              this.router.navigate(['home/users/family']);
            }
            if(this.rolChanger == 'Admin'){
            this.router.navigate(['home/users/list']);
            }
        },
        error: (error) => {
            console.error('Error al actualizar el usuario:', error);
            // Manejo de errores
        },
    });
  }

  redirectList() {
    const result = window.confirm("¿Estás seguro que quieres salir? No se guardarán los cambios realizados.");
    if (result) {
      if(this.rolChanger == 'Owner'){
        this.router.navigate(['home/users/family']);
      }
      if(this.rolChanger == 'Admin'){
      this.router.navigate(['home/users/list']);
      }
    }
  }


  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';  // Obtiene el parámetro 'name'

    console.log(this.id);
    

    this.apiService.getUserById(parseInt(this.id)).subscribe({
      next: (data: UserGet) => {        
        this.updateForm.get('name')?.setValue(data.name);
        this.updateForm.get('lastname')?.setValue(data.lastname);
        this.updateForm.get('dni')?.setValue(data.dni.toString());
        this.updateForm.get('email')?.setValue(data.email);
        this.updateForm.get('avatar_url')?.setValue(data.avatar_url);
        this.updateForm.get('datebirth')?.setValue(data.datebirth);
        const formattedDate = this.parseDateString(data.datebirth);
        this.updateForm.patchValue({
          datebirth: formattedDate ? this.formatDate(formattedDate) : ''
        });
        this.rolesInput = this.rolesSelected = data.roles;
        this.updateForm.get('phoneNumber')?.setValue(data.phone_number.toString());
        this.rolesSelected = data.roles;
        console.log(this.rolesSelected);
        console.log(data.roles);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    });
  }

  private parseDateString(dateString: string): Date | null {
    const [day, month, year] = dateString.split('-').map(Number);
    if (!day || !month || !year) {
      return null;
    }
    // Crea un objeto Date con formato "yyyy-MM-dd"
    return new Date(year, month - 1, day); // Restamos 1 al mes porque en JavaScript los meses son 0-indexed
  }

  // Formatea una fecha en "yyyy-MM-dd"
  private formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

}
