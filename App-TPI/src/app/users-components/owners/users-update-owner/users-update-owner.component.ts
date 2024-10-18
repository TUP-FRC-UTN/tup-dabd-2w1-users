import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerModel } from '../../../users-models/owner/PostOwnerDto';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../../../users-servicies/owner.service';
import { Owner } from '../../../users-models/owner/Owner';
import Swal from 'sweetalert2';
import { PutOwnerDto } from '../../../users-models/owner/PutOwnerDto';

@Component({
  selector: 'app-users-update-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-update-owner.component.html',
  styleUrl: './users-update-owner.component.css'
})
export class UsersUpdateOwnerComponent implements OnInit {
  owner: Owner = new Owner();
  id: string = "";

  private readonly ownerService = inject(OwnerService)
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    //conseguir el id
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.id);


    this.ownerService.getById(Number(this.id)).subscribe({
      next: (data: Owner) => {
        this.owner = data;
        console.log("Data: ", JSON.stringify(data, null, 2));
        console.log("Owner: " + this.owner);
        //llenar los inputs
        this.editOwner.patchValue({
          name: this.owner.name,
          lastname: this.owner.lastname,
          dni: this.owner.dni,
          cuitCuil: this.owner.cuitCuil,
          
          ownerType: this.owner.ownerType,
          taxStatus: this.owner.taxStatus,
          bussinesName: this.owner.bussinesName,
          phoneNumber : "",
          email: ""
        });
        const formattedDate = this.parseDateString(this.owner.dateBirth);
        this.editOwner.patchValue({
          birthdate: formattedDate ? this.formatDate(formattedDate) : ''
        });
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  //formulario base
  editOwner = new FormGroup({
    name: new FormControl("", [Validators.required]),
    lastname: new FormControl("", [Validators.required]),
    dni: new FormControl("", [Validators.required]),
    cuitCuil: new FormControl("", [Validators.required]),
    ownerType: new FormControl("", [Validators.required]),
    taxStatus: new FormControl("", [Validators.required]),
    bussinesName: new FormControl(""),
    birthdate: new FormControl("", [Validators.required]),
    phoneNumber: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email])
  });

  redirect(url: string) {
    this.router.navigate([`${url}`]);
  }

  createObject(form: any) {
    return {
      name: form.get('name')?.value,
      lastname: form.get('lastname')?.value,
      dni: form.get('dni')?.value,
      cuitCuil: form.get('cuitCuil')?.value,
      dateBirth: form.get('birthdate')?.value,
      ownerTypeId: form.get('ownerType')?.value,
      taxStatusId: form.get('taxStatus')?.value,
      bussinesName: form.get('bussinesName')?.value,
      phoneNumber: form.get('phoneNumber')?.value,
      email: form.get('email')?.value
    } as PutOwnerDto
  }

  updateOwner(form: any) {
    if (form.valid) {

      //se crea el objeto
      let ownerPut = this.createObject(form);
      console.log(ownerPut);
      

      //llama al service
      this.ownerService.putOwner(ownerPut, Number(this.id)).subscribe({
        next: (response) => {

          //mostrar alerta
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Se han guardado los cambios",
            showConfirmButton: false,
            timer: 1500
          });

          //redirigir a la lista
          this.redirect('home/owner/list');
        },
        error: (error) => {
          console.log(error);
          
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

  private parseDateString(dateString: string): Date | null {
    const [day, month, year] = dateString.split('-').map(Number);
    if (!day || !month || !year) {
      return null;
    }
    // Crea un objeto Date con formato "yyyy-MM-dd"
    return new Date(year, month - 1, day); // Restamos 1 al mes porque en JavaScript los meses son 0-indexed
  }

  // Formatea una fecha en "yyyy-MM-dd"
  private formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
}
