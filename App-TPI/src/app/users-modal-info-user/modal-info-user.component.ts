import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '../users-models/User';
import { ApiServiceService } from '../users-servicies/api-service.service';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-info-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-info-user.component.html',
  styleUrl: './modal-info-user.component.css'
})
export class ModalInfoUserComponent implements OnInit {

  @Input() userModal: UserModel = new UserModel();
  @Input() typeModal: string = '';

  //activeModal = inject(NgbActiveModal);
  private readonly apiService = inject(ApiServiceService);
  rolesInput: string[] = [];

  editUser: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.editUser = this.fb.group({
      name: [''],
      lastName: [''],
      email: [''],
      dni: [''],
      phoneNumber: [''],
      birthdate: ['']
    });
  }

  // Inicializa el formulario
  // editUser = new FormGroup({
  //   name: new FormControl({ value: this.userModal.name, disabled: true }),
  //   lastName: new FormControl({ value: this.userModal.lastname, disabled: true }),
  //   email: new FormControl({ value: this.userModal.email, disabled: true }),
  //   dni: new FormControl({ value: this.userModal.dni, disabled: true }),
  //   phoneNumber: new FormControl({ value: this.userModal.phone_number, disabled: true }),
  //   birthdate: new FormControl({ value: this.userModal.datebirth, disabled: true }),
  //   roles: new FormControl({ value: this.rolesInput, disabled: true })
  // });

  // Método para detectar cambios en el @Input
  ngOnInit() {        
      // Actualiza los valores del formulario cuando cambian los datos del usuario
      if (this.userModal.datebirth) {
        const formattedDate = this.parseDateString(this.userModal.datebirth);
        this.editUser.patchValue({
          name: this.userModal.name,
          lastName: this.userModal.lastname,
          email: this.userModal.email,
          dni: this.userModal.dni,
          phoneNumber: this.userModal.phone_number,
          roles: this.rolesInput,
          birthdate: formattedDate ? this.formatDate(formattedDate) : ''
        });
      }
  }

  // Convierte la cadena de fecha "dd-MM-yyyy" a un objeto Date
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

  confirmDeactivate() {
    this.apiService.desactivateUser(this.userModal.id).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        this.activeModal.close();
        // Poner un sweetAlert
      },
      error: (error) => {
        console.error('Error al eliminar el usuario:', error);
        // Poner un sweetAlert
      }
    });
  }

  closeModal(){
    this.activeModal.close();
  }

  confirmDelete() {
    Swal .fire({
      title: '¿Seguro que desea eliminar el usuario?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado!', '', 'success');
        this.confirmDeactivate();
      } else{
        Swal.fire('Operación cancelada!', '', 'info');
      }
    });
  }  
  
}
