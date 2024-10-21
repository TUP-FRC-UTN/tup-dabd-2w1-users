import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserGet } from '../../../users-models/users/UserGet';
import { UserService } from '../../../users-servicies/user.service';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteUser } from '../../../users-models/owner/DeleteUser';
import { DateService } from '../../../users-servicies/date.service';


@Component({
  selector: 'app-modal-info-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-info-user.component.html',
  styleUrl: './modal-info-user.component.css'
})
export class ModalInfoUserComponent implements OnInit {

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

  @Input() userModal: UserGet = new UserGet();
  @Input() typeModal: string = '';

  //activeModal = inject(NgbActiveModal);
  private readonly apiService = inject(UserService);
  
  rolesInput: string[] = [];
  editUser: FormGroup;

  // Método para detectar cambios en el @Input
  ngOnInit() {        
      // Actualiza los valores del formulario cuando cambian los datos del usuario
      if (this.userModal.datebirth) {
        const formattedDate = DateService.parseDateString(this.userModal.datebirth);
        this.editUser.patchValue({
          name: this.userModal.name,
          lastName: this.userModal.lastname,
          email: this.userModal.email,
          dni: this.userModal.dni,
          phoneNumber: this.userModal.phone_number,
          roles: this.rolesInput,
          birthdate: formattedDate ? DateService.formatDate(formattedDate) : ''
        });
      }

      this.editUser.disable();
    
  }

  confirmDesactivate() {
    var user = new DeleteUser();
    user.id = this.userModal.id;
    user.userIdUpdate = 1; // Cambiar por el id del usuario logueado
    this.apiService.deleteUser(user).subscribe({
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
        this.confirmDesactivate();
      } else{
        Swal.fire('Operación cancelada!', '', 'info');
      }
    });
  }  
  
}
