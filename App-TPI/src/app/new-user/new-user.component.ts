import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolModel } from '../models/Rol';
import { ApiServiceService } from '../servicies/api-service.service';
import { UserModel } from '../models/User';
import { UserPost } from '../models/UserPost';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {

  formReactivo = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    dni: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
    fecha: new FormControl(this.formatDate(new Date()), [Validators.required]),
    rol: new FormControl('') 
  });

  private formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  private readonly apiService = inject(ApiServiceService);

  
  roles: RolModel[] = [];

  rolesHtmlString: string = '';  //
  rolesString: string = "Roles añadidos:";
  rolesInput: string[] = [];
  select: string = "";

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

  resetForm() {
    this.formReactivo.reset();
    this.rolesInput = [];
  }

  createUser() {
    
    const fechaValue = this.formReactivo.get('fecha')?.value;
    
    const userData : UserPost = {
      name: this.formReactivo.get('nombre')?.value || '',
    lastname: this.formReactivo.get('apellido')?.value || '',
    username: this.formReactivo.get('username')?.value || '',
    password: this.formReactivo.get('dni')?.value || '',
    email: this.formReactivo.get('email')?.value || '',
    dni: Number(this.formReactivo.get('dni')?.value) || 0,
    active: true,
    avatar_url: '',
    datebirth: fechaValue ? 
                   new Date(fechaValue).toISOString().split('T')[0] : '',
    roles: this.rolesInput,
    phone_number: this.formReactivo.get('telefono')?.value || ''
    };

    console.log(userData);

    this.apiService.postUser(userData).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente:', response);
        alert('Usuario creado exitosamente');
        // Aquí podrías redirigir o actualizar la UI
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear el usuario:', error);
        // Manejo de errores, podrías mostrar un mensaje al usuario
      },
    });
  }
}