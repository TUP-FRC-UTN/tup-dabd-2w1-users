import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserModel } from '../models/User';
import { ApiServiceService } from '../servicies/api-service.service';
import { RolModel } from '../models/Rol';

@Component({
  selector: 'app-modal-info-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-info-user.component.html',
  styleUrl: './modal-info-user.component.css'
})
export class ModalInfoUserComponent implements OnChanges{

  @Input() userModal: UserModel = new UserModel();

  rolesInput: string[] = [];


  ngOnChanges(changes: SimpleChanges): void {
    this.editUser = new FormGroup({
      name: new FormControl(this.userModal.name, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(this.userModal.lastname, []),
      email: new FormControl(this.userModal.email, []),
      dni: new FormControl(this.userModal.dni, []),
      phoneNumber: new FormControl(this.userModal.phone_number, []),
      birthdate: new FormControl(this.userModal.datebirth, []),
      roles : new FormControl(this.rolesInput, [])
    });
  }

  editUser = new FormGroup({
    name: new FormControl(this.userModal.name, [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl(this.userModal.lastname, []),
    email: new FormControl(this.userModal.email, []),
    dni: new FormControl(this.userModal.dni, []),
    phoneNumber: new FormControl(this.userModal.phone_number, []),
    birthdate: new FormControl(this.userModal.datebirth, []),
    roles : new FormControl(this.rolesInput, [])
  });
}

