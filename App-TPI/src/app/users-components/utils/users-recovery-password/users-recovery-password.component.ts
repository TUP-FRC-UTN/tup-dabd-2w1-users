import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-recovery-password',
  standalone: true,
  imports: [],
  templateUrl: './users-recovery-password.component.html',
  styleUrl: './users-recovery-password.component.css'
})
export class UsersRecoveryPasswordComponent {

  email = new FormControl('',[Validators.required]);

  //El método debe conectarse con Notificaciones 
  //para enviar al email suministrado una contraseña o token provisorio
  sendMail() {

  }

}
