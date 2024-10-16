import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../users-servicies/api-service.service';
import { LoginUser } from '../users-models/Login';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() validacion = new EventEmitter<void>();

  constructor(private router: Router) { }

  user: LoginUser = new LoginUser();
  correoInput: string = "";
  claveInput: string = "";

  private readonly apiService = inject(ApiServiceService);

  loginForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
  });


  ingresar(form: any) {
    if (form.invalid) {
      alert("no se logueo")
    }
    else {
      this.user.dni = this.loginForm.value.name!;
      this.user.password = this.loginForm.value.password!;

      this.apiService.verifyLogin(this.user).subscribe({
        next: (data) => {

          if (data) {
            alert("se logueo")
            this.router.navigate(['/home']);
          }
          else {
            alert("Dni o contraseña incorrectos")
          }
        },
        error: (error) => {
          alert("Dni o contraseña incorrectos")
        }
      });
    };
  }
}