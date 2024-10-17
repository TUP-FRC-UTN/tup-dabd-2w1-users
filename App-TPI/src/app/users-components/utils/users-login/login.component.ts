import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../users-servicies/api-service.service';
import { LoginUser } from '../../../users-models/Login';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../users-servicies/login.service';

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
  private readonly loginService = inject(LoginService);

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
  });

  async login() {
    if (this.loginForm.invalid) {
      alert("no se logueo");
    } else {
      this.user.email = this.loginForm.value.email!;
      this.user.password = this.loginForm.value.password!;

      this.apiService.verifyLogin(this.user).subscribe({
        next: async (data) => {
          if (data) {
            try {
              await this.loginService.setUser(this.user.email);
              this.router.navigate(['/home']); // Redirige solo cuando se haya obtenido el usuario
            } catch (error) {
              alert("Error obteniendo los datos del usuario.");
            }
          } else {
            alert("Dni o contraseña incorrectos");
          }
        },
        error: (error) => {
          alert("Dni o contraseña incorrectos");
        }
      });
    }
  }
}
