import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../servicies/api-service.service';
import { RolModel } from '../models/Rol';
import { UserModel } from '../models/User';
import { UserPut } from '../models/UserPut';
import { data } from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-update-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './users-update-user.component.html',
  styleUrl: './users-update-user.component.css'
})
export class UsersUpdateUserComponent implements OnInit {

  
  private readonly apiService = inject(ApiServiceService);

  constructor(private router: Router, private route: ActivatedRoute){ }

    
  roles: RolModel[] = [];
  rolesInput: string[] = [];
  id: string = '';

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

    

    user.roles = this.rolesInput || ['Admin']; // Asegúrate de que roles sea un arreglo

    console.log(user);

    // Llama al servicio para actualizar el usuario
    this.apiService.putUser(user, parseInt(this.id)).subscribe({
        next: (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            alert('Usuario actualizado exitosamente');
            this.router.navigate(['home/users/list']);
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
    this.router.navigate(['home/users/list']);
  }
}


  
  ngOnInit() {
    this.loadRoles();

    this.id = this.route.snapshot.paramMap.get('id') || '';  // Obtiene el parámetro 'name'

    console.log(this.id);
    

    this.apiService.getUserById(parseInt(this.id)).subscribe({
      next: (data: UserModel) => {        
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
        this.rolesInput = data.roles;
        this.updateForm.get('phoneNumber')?.setValue(data.phone_number.toString());
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
