import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerModel } from '../../../users-models/owner/PostOwnerDto';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../../../users-servicies/owner.service';
import { Owner } from '../../../users-models/owner/Owner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-update-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-update-owner.component.html',
  styleUrl: './users-update-owner.component.css'
})
export class UsersUpdateOwnerComponent implements OnInit{
  @Input() owner : OwnerModel = new OwnerModel;
  id : string = "";
  private readonly ownerService = inject(OwnerService)
  constructor(private router : Router, private route: ActivatedRoute){}
  
  ngOnInit(): void {
    //llenar los inputs
    this.editOwner.patchValue({
      name: this.owner.name,
      lastname: this.owner.lastname,
      dni: this.owner.dni,
      cuitCuil: this.owner.cuitCuil,
      birthdate: this.owner.dateBirth,
      email: this.owner.email,
      phone_number: this.owner.phoneNumber,
      bussines_name: this.owner.bussinesName,
      active: this.owner.active
    });

    //conseguir el id
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }
  
  //formulario base
  editOwner = new FormGroup({
    name: new FormControl("", [Validators.required]),
    lastname: new FormControl("", [Validators.required]),
    dni: new FormControl("", [Validators.required]),
    cuitCuil: new FormControl("", [Validators.required]),
    birthdate: new FormControl(new Date, [Validators.required]),
    email: new FormControl("", [Validators.required]),
    phone_number: new FormControl("", [Validators.required]),
    bussines_name: new FormControl("", []),  
    active : new FormControl(true, []),
  });

  redirect(url : string){
    this.router.navigate([`${url}`]);
  }

  createObject(form : any){
    return {
      name: form.get('name')?.value,
      lastname: form.get('lastname')?.value,
      dni: form.get('dni')?.value,
      cuitCuil: form.get('cuitCuil')?.value,
      dateBirth: form.get('birthdate')?.value,
      email: form.get('email')?.value,
      phoneNumber: form.get('phone_number')?.value,
      bussinesName: form.get('bussines_name')?.value,
      active: form.get('active')?.value
    } as OwnerModel
  }

  updateOwner(form : any){
    if(form.valid){

      //se crea el objeto
      let ownerPut = this.createObject(form);

      //llama al service
      this.ownerService.putOwner(ownerPut, Number(this.id)).subscribe({
        next: (response) =>{

          //mostrar alerta
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Se han guardado los cambios",
            showConfirmButton: false,
            timer: 1500
          }); 

          //redirigir
          this.redirect('home/owner/list');
        },
        error: (error) =>{

          //mostrar alerta de error
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ha ocurrido un error",
            showConfirmButton: false,
            timer: 1500
          }); 
        }
      })
    }
  }
}
