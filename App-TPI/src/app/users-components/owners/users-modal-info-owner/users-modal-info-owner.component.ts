import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Owner } from '../../../users-models/owner/Owner';

@Component({
  selector: 'app-users-modal-info-owner',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users-modal-info-owner.component.html',
  styleUrl: './users-modal-info-owner.component.css'
})
export class UsersModalInfoOwnerComponent implements OnInit{
  @Input() ownerModel: Owner = new Owner();
  infoOwner : FormGroup;

  ngOnInit(): void {
    this.infoOwner.patchValue({
      name: this.ownerModel.name,
      lastname: this.ownerModel.lastname,
      dni: this.ownerModel.dni,
      cuitCuil: this.ownerModel.cuitCuil,
      birthdate: this.ownerModel.dateBirth,
      ownerType: this.ownerModel.ownerType,
      taxStatus: this.ownerModel.taxStatus,
      businessName: this.ownerModel.bussinesName

    });
    this.infoOwner.disable();
    
  }

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {

    this.infoOwner = this.fb.group({
      name: [''],
      lastname: [''],
      dni: [''],
      cuitCuil: [''],
      birthdate: [''],
      ownerType: [''],
      taxStatus: [''],
      businessName: [''],
      active: [''] //no se muestra en el form xq se deberían traer por defecto los activos
    });
  }

  closeModal(){
    this.activeModal.close();
  }
}
