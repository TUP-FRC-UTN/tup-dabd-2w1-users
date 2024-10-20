import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../users-servicies/user.service';
import { LoginUser } from '../../../users-models/users/Login';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../users-servicies/login.service';
import { AuthService } from '../../../users-servicies/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  @Output() validacion = new EventEmitter<void>();




  ngOnInit(): void {

  }

  //muestra un mensaje si los datos ingresados son incorrectos
  errorLog : boolean = false;

  constructor(private router: Router) { }

  user: LoginUser = new LoginUser();
  correoInput: string = "";
  claveInput: string = "";

  private readonly apiService = inject(UserService);
  private readonly loginService = inject(LoginService);
  private readonly authService = inject(AuthService);

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
  });

  async login() {
    if (this.loginForm.invalid) {
    } else {
      this.user.email = this.loginForm.value.email!;
      this.user.password = this.loginForm.value.password!;

      this.apiService.verifyLogin(this.user).subscribe({
        next: async (data) => {
          if (data) {
            await this.authService.login(data);
            this.errorLog = false;
            this.router.navigate(['home']); // Redirige solo cuando se haya obtenido el usuario
          } else {
            alert("Dni o contraseña incorrectos");
          }
        },
        error: (error) => {
          this.errorLog = true;
        }
      });
    }
  }
}
