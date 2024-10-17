import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolModel } from '../../../users-models/Rol';
import { ApiServiceService } from '../../../users-servicies/api-service.service';
import { UserModel } from '../../../users-models/User';
import { UserPost } from '../../../users-models/UserPost';
import { Router, RouterModule } from '@angular/router';
import { UsersSelectMultipleComponent } from "../../utils/users-select-multiple/users-select-multiple.component";

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule, UsersSelectMultipleComponent],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {

  rolesSelected : string[] = [];

  constructor(private router:Router){
    
  }

  formReactivo = new FormGroup({
    nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    username: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
    ]),
    email: new FormControl('', [
        Validators.required,
        Validators.email
    ]),
    telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
    ]),
    dni: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(11)
    ]),
    active: new FormControl(true, [Validators.required]), 
    avatar_url: new FormControl(''),
    fecha: new FormControl(this.formatDate(new Date("2000-01-01")), [Validators.required]),
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
    console.log(this.formReactivo.errors);
    
    const rolSeleccionado = this.formReactivo.get('rol')?.value;
    if (rolSeleccionado && !this.rolesInput.includes(rolSeleccionado)) {  
      this.rolesInput.push(rolSeleccionado);  
    }
    this.formReactivo.get('rol')?.setValue('');
  }

  redirect(path:string){
    this.router.navigate([path]);
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
      dni: this.formReactivo.get('dni')?.value || "",
      active: true,
      avatar_url: '',
      datebirth: fechaValue ? 
                    new Date(fechaValue).toISOString().split('T')[0] : '',
      roles: this.rolesSelected,
      phone_number: this.formReactivo.get('telefono')?.value || '',
      userUpdateId: 5
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