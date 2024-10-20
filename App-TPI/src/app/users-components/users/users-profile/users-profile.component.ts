import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../users-servicies/login.service';
import { UserService } from '../../../users-servicies/user.service';
import { UserModel } from '../../../users-models/users/User';
import { UserPut } from '../../../users-models/users/UserPut';

@Component({
  selector: 'app-users-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.css'
})
export class UsersProfileComponent implements OnInit {

  private readonly loginService = inject(LoginService);
  private readonly usersService = inject(UserService);
  type: string = 'info';

  selectedIconUrl: string = '../../../../assets/icons/icono1.svg';
  isDropdownOpen = false;
  icons = [
    {name: 'Icono 1', url:'../../../../assets/icons/icono1.svg'},
    {name: 'Icono 2', url:'../../../../assets/icons/icono2.svg'},
    {name: 'Icono 3', url:'../../../../assets/icons/icono3.svg'},
    {name: 'Icono 4', url:'../../../../assets/icons/icono4.svg'},
    {name: 'Icono 5', url:'../../../../assets/icons/icono5.svg'},
    {name: 'Icono 6', url:'../../../../assets/icons/icono6.svg'},
    {name: 'Icono 7', url:'../../../../assets/icons/icono7.svg'},
    {name: 'Icono 8', url:'../../../../assets/icons/icono8.svg'},
    {name: 'Icono 9', url:'../../../../assets/icons/icono9.svg'},
    {name: 'Icono 10', url:'../../../../assets/icons/icono10.svg'},
  ]

  onIconSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedIconUrl = selectElement.value;
  }

  selectIcon(url: string) {
    this.selectedIconUrl = url;
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  user: UserModel = null!;

  formReactivo = new FormGroup({
    nombre: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    apellido: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    username: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
    ]),
    email: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.email
    ]),
    telefono: new FormControl({value: 0, disabled: true }, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
    ]),
    dni: new FormControl({value: 0, disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(11)
    ]),
    active: new FormControl(true, [Validators.required]), 
    avatar_url: new FormControl({value: '...', disabled: true }),
    fecha: new FormControl({value: '', disabled: true }, [Validators.required]),
    roles: new FormControl<string[]>({value: [], disabled: true }) 
});

ngOnInit(): void {
  // cuando se este logueado hay que poner esto this.loginService.getUserId()!
  this.usersService.getUserById(2).subscribe({
      next: (user: UserModel) => {
          this.user = user;
          console.log(user);
          
          this.formReactivo.patchValue({
              nombre: user.name,
              apellido: user.lastname,
              username: user.username,
              email: user.email,
              telefono: user.phone_number,
              dni: user.dni,
              active: user.active,
              avatar_url: user.avatar_url,
              roles: user.roles ,
  
          });

          this.selectedIconUrl = user.avatar_url;

          const formattedDate = this.parseDateString(user.datebirth);
          this.formReactivo.patchValue({
            fecha: formattedDate ? this.formatDate(formattedDate) : ''
          });
      }
  })
  };

  changeType(newType: string): void {
    this.type = newType;
    if(newType == 'edit'){
      this.formReactivo.get('nombre')?.enable();
      this.formReactivo.get('apellido')?.enable();
      this.formReactivo.get('dni')?.enable();
      this.formReactivo.get('avatar_url')?.enable();
    }
    if(newType == 'info'){
      this.formReactivo.disable();
    }
}


  private parseDateString(dateString: string): Date | null {
    const [day, month, year] = dateString.split('-').map(Number);
    if (!day || !month || !year) {
      return null;
    }
    // Crea un objeto Date con formato "yyyy-MM-dd"
    return new Date(year, month - 1, day); // Restamos 1 al mes porque en JavaScript los meses son 0-indexed
  }

  private formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  updateUser() {
    const user: UserPut = new UserPut();
    user.userUpdateId = 2;
    user.name = this.formReactivo.get('nombre')?.value || '';
    user.lastName = this.formReactivo.get('apellido')?.value || '';
    user.dni = this.formReactivo.get('dni')?.value?.toString() || ''; 
    user.phoneNumber = this.formReactivo.get('telefono')?.value?.toString() || '';
    user.email = this.formReactivo.get('email')?.value || '';
    user.avatar_url = this.selectedIconUrl;
    user.telegram_id = 0;
    // Formatea la fecha correctamente (año-mes-día)
    const date: Date = new Date(this.formReactivo.get('fecha')?.value || '');

// Formatear la fecha como YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    user.datebirth = formattedDate;
    user.roles = this.formReactivo.get('roles')?.value || [];


    console.log(user);

    // Llama al servicio para actualizar el usuario
    this.usersService.putUser(user, 2).subscribe({
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

}
