import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../servicies/api-service.service';
import { RolModel } from '../models/Rol';
import { UserModel } from '../models/User';
import { UserPut } from '../models/UserPut';
import { data } from 'jquery';

@Component({
  selector: 'app-users-update-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './users-update-user.component.html',
  styleUrl: './users-update-user.component.css'
})
export class UsersUpdateUserComponent implements OnInit {

  
  private readonly apiService = inject(ApiServiceService);

    
  roles: RolModel[] = [];
  rolesInput: string[] = [];

  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
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

    

    user.roles = this.rolesInput || ['Admin']; // Asegúrate de que roles sea un arreglo

    console.log(user);

    // Llama al servicio para actualizar el usuario
    this.apiService.putUser(user, 14).subscribe({
        next: (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            alert('Usuario actualizado exitosamente');
        },
        error: (error) => {
            console.error('Error al actualizar el usuario:', error);
            // Manejo de errores
        },
    });
}


  
  ngOnInit() {
    this.loadRoles();

    this.apiService.getUserByEmail('123@123asd').subscribe({
      next: (data: UserModel) => {        
        this.updateForm.get('name')?.setValue(data.name);
        this.updateForm.get('lastname')?.setValue(data.lastname);
        this.updateForm.get('dni')?.setValue(data.dni.toString());
        this.updateForm.get('email')?.setValue(data.email);
        this.updateForm.get('avatar_url')?.setValue(data.avatar_url);
        this.updateForm.get('datebirth')?.setValue(data.datebirth);
        this.rolesInput = data.roles;
        this.updateForm.get('phoneNumber')?.setValue(data.phone_number.toString());
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    });
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

  aniadirRol() {
    const rolSeleccionado = this.updateForm.get('roles')?.value;
    if (rolSeleccionado && !this.rolesInput.includes(rolSeleccionado)) {  
      this.rolesInput.push(rolSeleccionado);  
    }
    this.updateForm.get('roles')?.setValue('');
  }

  quitarRol(rol: string) {
    const index = this.rolesInput.indexOf(rol);
    if (index > -1) {
      this.rolesInput.splice(index, 1);
    }
  }

}
