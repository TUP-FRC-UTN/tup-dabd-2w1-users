import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-update-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-update-owner.component.html',
  styleUrl: './users-update-owner.component.css'
})
export class UsersUpdateOwnerComponent {
  editOwner = new FormGroup({
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

  updateOwner(){}
}
