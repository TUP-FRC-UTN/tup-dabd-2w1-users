import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() validacion = new EventEmitter<void>();

  correoInput : string = "";
  claveInput : string = "";

  ingresar(form : any){
    if(form.invalid){
      alert("no se logueo")
    }
    else{
      alert("se logueo")
      this.validacion.emit();
    }
  }
}
