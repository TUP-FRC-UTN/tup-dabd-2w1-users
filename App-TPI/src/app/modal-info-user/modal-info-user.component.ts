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

  private readonly apiService = inject(ApiServiceService);

  roles: RolModel[] = [];
  select: string = "";
  rolesInput: string[] = [];


  ngOnChanges(changes: SimpleChanges): void {
    this.editUser = new FormGroup({
      name: new FormControl(this.userModal.name, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(this.userModal.lastname, []),
      email: new FormControl(this.userModal.email, []),
      dni: new FormControl(this.userModal.dni, []),
      phoneNumber: new FormControl(this.userModal.phone_number, []),
      birthdate: new FormControl(this.userModal.datebirth, [])
    });
    this.changeEdit();
    this.loadRoles(); 
  }

  editUser = new FormGroup({
    name: new FormControl(this.userModal.name, [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl(this.userModal.lastname, []),
    email: new FormControl(this.userModal.email, []),
    dni: new FormControl(this.userModal.dni, []),
    phoneNumber: new FormControl(this.userModal.phone_number, []),
    birthdate: new FormControl(this.userModal.datebirth, [])
  });

  canEdit: boolean = false;

  changeEdit() {
    if (this.canEdit) {
      this.editUser.disable();
    } else {
      this.editUser.enable();
    }
    this.canEdit = !this.canEdit;
  }

  edit(form: any) {
    if (this.editUser.valid) {
      console.log('Formulario enviado:', this.editUser.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  loadRoles() {
    this.apiService.getAllRoles().subscribe({
      next: (data: RolModel[]) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error al cargar los roles:', error);
      }
    });
  }

   aniadirRol() {
    if (this.select && !this.rolesInput.includes(this.select)) {  // Evita duplicados
      this.rolesInput.push(this.select);  
    }
  }

  quitarRol(rol: string) {
    const index = this.rolesInput.indexOf(rol);
    if (index > -1) {
      this.rolesInput.splice(index, 1);
    }
  }

}

