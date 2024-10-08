import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolModel } from '../models/Rol';
import { ApiServiceService } from '../servicies/api-service.service';
import { UserModel } from '../models/User';
import { UserPost } from '../models/UserPost';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {
  private readonly apiService = inject(ApiServiceService);

  
  roles: RolModel[] = [];

  rolesHtmlString: string = '';  //
  rolesString: string = "Roles añadidos:";
  rolesInput: string[] = [];
  select: string = "";


  nameInput: string = "";
  lastNameInput: string = "";
  usernameInput: string = "";
  emailInput: string = "";
  dniInput: string = "";
  telefonoInput: string = "";
  birthdateInput: Date = new Date();

  ngOnInit() {
    this.loadRoles();
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
    if (this.select && !this.rolesInput.includes(this.select)) {  // Evita duplicados
      this.rolesInput.push(this.select);  
    }
  }

  quitarRol(rol: string) {
    const index = this.rolesInput.indexOf(rol);
    if (index > -1) {
      this.rolesInput.splice(index, 1);
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  

  createUser(form: any) {
    const userData : UserPost = {
      name: form.value.nameInp,
      lastname: form.value.lastNameImp,
      username: this.usernameInput,
      password: this.dniInput,
      email: form.value.emailInp,
      dni: form.value.dniInp,
      contact_id: 1,
      active: true,
      avatar_url: '',
      datebirth: this.formatDate(this.birthdateInput),
      roles: this.rolesInput  
    };

    console.log(userData);

    this.apiService.postUser(userData).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente:', response);
        // Aquí podrías redirigir o actualizar la UI
      },
      error: (error) => {
        console.error('Error al crear el usuario:', error);
        // Manejo de errores, podrías mostrar un mensaje al usuario
      },
    });
  }
}