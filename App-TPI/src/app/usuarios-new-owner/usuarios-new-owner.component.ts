import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios-new-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './usuarios-new-owner.component.html',
  styleUrl: './usuarios-new-owner.component.css'
})
export class UsuariosNewOwnerComponent {
   newOwner = new FormGroup({
     name: new FormControl("", [Validators.required]),
     lastname: new FormControl("", [Validators.required]),
     dni: new FormControl("", [Validators.required]),
     cuit_cuil: new FormControl("", [Validators.required]),
     birthdate: new FormControl("", [Validators.required]),
     email: new FormControl("", [Validators.required]),
     phone_number: new FormControl("", [Validators.required]),
     bussines_name: new FormControl("", []),  
     active : new FormControl(true, []),
   });


   createOwner(){
      console.log(this.newOwner.value);
   }
}
