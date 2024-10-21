import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { UserGet } from '../../../users-models/users/UserGet';
import { UserPut } from '../../../users-models/users/UserPut';
import { AuthService } from '../../../users-servicies/auth.service';
import { DateService } from '../../../users-servicies/date.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.css'
})
export class UsersProfileComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UserService);

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

  //Cambia la acción del botón
  type: string = 'info';

  ngOnInit(): void {
    this.usersService.getUserById(this.authService.getUser().id).subscribe({
        next: (user: UserGet) => {

            this.formProfile.patchValue({
                name: user.name,
                lastName: user.lastname,
                email: user.email,
                username: user.username,
                phoneNumber: user.phone_number,
                dni: user.dni,
                avatar_url: user.avatar_url,
                roles: user.roles ,
                telegram_id: user.telegram_id
            });
  
            // Setea el icono del usuario en el input
            this.selectedIconUrl = user.avatar_url;
  
            // Setea la fecha de nacimiento en el input
            const formattedDate :Date = DateService.parseDateString(user.datebirth)!;
            this.formProfile.patchValue({
              datebirth: formattedDate ? DateService.formatDate(formattedDate) : ''
            });
        }
    })
  };

  //Crea y establece las validaciones del formulario
  formProfile = new FormGroup({
    name: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    lastName: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
    ]),
    username: new FormControl({value: "", disabled: true }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(30)
    ]),
    telegram_id: new FormControl({value: 0, disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
    ]),
    email: new FormControl({value: '...', disabled: true }, [
        Validators.required,
        Validators.email
    ]),
    phoneNumber: new FormControl({value: 0, disabled: true }, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
    ]),
    dni: new FormControl({value: 0, disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(11)
    ]),
    avatar_url: new FormControl({value: '...', disabled: true }),
    datebirth: new FormControl({value: '', disabled: true }, [Validators.required]),
    roles: new FormControl<string[]>({value: [], disabled: true }) 
});

  //Setea la url del icono seleccionado
  onIconSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedIconUrl = selectElement.value;
  }

  //Método para seleccionar un icono
  selectIcon(url: string) {
    this.selectedIconUrl = url;
    this.isDropdownOpen = false;
  }

  //Abre o cierra el dropdown para los iconos
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  //Cambiar el botón
  changeType(newType: string): void {
    this.type = newType;
    if(newType == 'edit'){
      this.formProfile.get('name')?.enable();
      this.formProfile.get('lastName')?.enable();
      this.formProfile.get('phoneNumber')?.enable();
      this.formProfile.get('avatar_url')?.enable();
      this.formProfile.get('telegram_id')?.enable();
    }
    if(newType == 'info'){
      this.ngOnInit();
      this.formProfile.disable();
    }
  }
  
  //Crea un UserPut
  updateUser() {
    const updatedUser: UserPut = {
        userUpdateId: this.authService.getUser().id,
        name: this.formProfile.get('name')?.value || '',
        lastName: this.formProfile.get('lastName')?.value || '',
        email: this.formProfile.get('email')?.value || '',
        phoneNumber: this.formProfile.get('phoneNumber')?.value?.toString() || '',
        dni: this.formProfile.get('dni')?.value?.toString() || '',
        avatar_url: this.selectedIconUrl,
        datebirth: this.formProfile.get('datebirth')?.value || '',
        roles: this.formProfile.get('roles')?.value || [],
        telegram_id: this.formProfile.get('telegram_id')?.value || 0,
    };

    this.usersService.putUser(updatedUser, this.authService.getUser().id).subscribe({
        next: (response) => {
            Swal.fire({
                title: 'Perfil actualizado',
                text: 'El perfil se actualizó correctamente',
                icon: 'success',
            })
            this.changeType('info');
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error al actualizar el perfil',
            icon: 'error',
        })
        },
    });
  }
}