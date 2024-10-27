import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OwnerModel } from '../../../users-models/owner/PostOwnerDto';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../../../users-servicies/owner.service';
import { Owner } from '../../../users-models/owner/Owner';
import Swal from 'sweetalert2';
import { PutOwnerDto } from '../../../users-models/owner/PutOwnerDto';
import { FileService } from '../../../users-servicies/file.service';
import { FileDto } from '../../../users-models/owner/FileDto';
import { FileUploadComponent } from '../../utils/file-upload/file-upload.component';
import { UserService } from '../../../users-servicies/user.service';
import { OwnerPlotUserDto } from '../../../users-models/owner/OwnerPlotUserDto';
import { UserGet } from '../../../users-models/users/UserGet';
import { DateService } from '../../../users-servicies/date.service';

@Component({
  selector: 'app-users-update-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FileUploadComponent],
  templateUrl: './users-update-owner.component.html',
  styleUrl: './users-update-owner.component.css'
})
export class UsersUpdateOwnerComponent implements OnInit {
  owner: Owner = new Owner();
  existingFiles: File[] = [];
  newFiles: File[] = [];
  existingFilesDownload: FileDto[] = [];
  id: string = "";

  private readonly ownerService = inject(OwnerService)
  private readonly fileService = inject(FileService);
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    //conseguir el id
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.id);

    // this.ownerService.getById(Number(this.id)).subscribe({
    //   next: (data : Owner) => {
    //     this.owner = data;
    //     console.log("Data: ", JSON.stringify(data, null, 2));
    //     console.log("Owner: " + this.owner);
    //     //llenar los inputs
    //     this.editOwner.patchValue({
    //       name: this.owner.name,
    //       lastname: this.owner.lastname,
    //       dni: this.owner.dni,
    //       cuitCuil: this.owner.cuitCuil,

    //       ownerType: this.owner.ownerType,
    //       taxStatus: this.owner.taxStatus,
    //       bussinesName: this.owner.bussinesName,
    //       phoneNumber : "",
    //       email: ""
    //     });



    //      if(this.owner.files.length > 0){
    //        this.existingFilesDownload = this.owner.files;
    //      }

    //     if (this.owner.files && this.owner.files.length > 0) {
    //       for (const fileDto of this.owner.files) {

    //         console.log("FileDto: ", fileDto.uuid);

    //         this.fileService.getFile(fileDto.uuid).subscribe(({ blob, filename }) => {
    //           // Crear un nuevo objeto File a partir del Blob
    //           const newFile = new File([blob], filename, { type: blob.type });

    //           console.log("New File: ", newFile);
    //           this.existingFiles.push(newFile);
    //         }, error => {
    //           console.error(`Error al descargar el archivo ${fileDto.uuid}, error`);
    //         });
    //         console.log("Files list after loading: ", this.existingFiles);
    //       }
    //     }

    //     const formattedDate = this.parseDateString(this.owner.dateBirth);
    //     this.editOwner.patchValue({
    //       birthdate: formattedDate ? this.formatDate(formattedDate) : ''
    //     });
    //   },
    //   error: (error) => {
    //     console.log(error)
    //   }
    // })

    this.ownerService.getByIdWithUser(Number(this.id)).subscribe({
      next: (data: OwnerPlotUserDto) => {
        this.owner = data.owner;
        console.log(data);

        //llenar los inputs
        this.editOwner.patchValue({
          name: this.owner.name,
          lastname: this.owner.lastname,
          dni: this.owner.dni,
          cuitCuil: this.owner.cuitCuil,
          ownerType: this.owner.ownerType,
          taxStatus: this.owner.taxStatus,
          bussinesName: this.owner.bussinesName,
          phoneNumber : data.user.phone_number,
          email: data.user.email,
        });

        const formattedDate = this.parseDateString(this.owner.dateBirth);

        this.editOwner.patchValue({
          birthdate: formattedDate ? this.formatDate(formattedDate) : ''
        });



         if(this.owner.files.length > 0){
           this.existingFilesDownload = this.owner.files;
         }

        if (this.owner.files && this.owner.files.length > 0) {
          for (const fileDto of this.owner.files) {

            this.fileService.getFile(fileDto.uuid).subscribe(({ blob, filename }) => {
              // Crear un nuevo objeto File a partir del Blob
              const newFile = new File([blob], filename, { type: blob.type });
              this.existingFiles.push(newFile);
            }, error => {
              console.error(`Error al descargar el archivo ${fileDto.uuid}, error`);
            });
            console.log("Files list after loading: ", this.existingFiles);
          }
        }
      },
      error: (error) => {
        console.log(error)
      }
    })

  }

  //formulario base
  editOwner = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(50)]),
    lastname: new FormControl("", [Validators.required, Validators.maxLength(50)]),
    dni: new FormControl("", [Validators.required, Validators.pattern("^[0-9]{6,9}$")]),
    cuitCuil: new FormControl("", [Validators.required, Validators.pattern("^[0-9]{11}$")]),
    ownerType: new FormControl("", [Validators.required]),
    taxStatus: new FormControl("", [Validators.required]),
    bussinesName: new FormControl(""),
    birthdate: new FormControl("", [Validators.required]),
    phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^[0-9]{9,20}$")]),
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
      ownerTypeId: 1,//form.get('ownerType')?.value,
      taxStatusId: 1,//form.get('taxStatus')?.value,
      businessName: form.get('bussinesName')?.value,
      phoneNumber: form.get('phoneNumber')?.value,
      email: form.get('email')?.value,
      files: this.newFiles,
      userUpdateId: 1,
      active: true
    } as PutOwnerDto
  }

  getFiles(files: File[]) {
    this.newFiles = files;
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
          this.redirect('home/owners/list');
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

  confirmExit() {
    Swal.fire({
      title: '¿Seguro que desea cancelar la operación?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.editOwner.reset();
        this.redirect('/home/owners/list');
        Swal.fire('Operación cancelada', '', 'info');
      }
    });
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


  downloadFile(fileId: string) {
    this.fileService.getFile(fileId).subscribe(({ blob, filename }) => {
      // Crear una URL desde el Blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace de descarga dinámico
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;  // Nombre del archivo obtenido desde el encabezado
      document.body.appendChild(a);
      a.click();  // Simular el clic para descargar el archivo

      // Limpiar el DOM y liberar el Blob después de la descarga
      window.URL.revokeObjectURL(url);
      a.remove();
    }, error => {
      console.error('Error al descargar el archivo', error);
    });
  }

}
