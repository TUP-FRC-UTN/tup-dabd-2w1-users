import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteUser } from '../../../../users-models/owner/DeleteUser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../users-servicies/user.service';
import { UserGet } from '../../../../users-models/users/UserGet';

@Component({
  selector: 'app-modal-eliminar-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ],
  templateUrl: './modal-eliminar-user.component.html',
  styleUrl: './modal-eliminar-user.component.css'
})
export class ModalEliminarUserComponent {

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private apiService: UserService, private modal: NgbModal) {
  }

  @Input() userModal: { id: number } = { id: 0 }; // Recibe solo el userId

  confirmDesactivate() {
    var user = new DeleteUser();
    user.id = this.userModal.id;
    user.userIdUpdate = 1; // Cambiar por el id del usuario logueado
    this.apiService.deleteUser(user).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        this.activeModal.close();
        this.showSuccessModal(); // Muestra el modal temporal de éxito (Aún sin implementar)
      },
      error: (error) => {
        console.error('Error al eliminar el usuario:', error);
        this.showErrorModal(); // Muestra el modal temporal de error (Aún sin implementar)
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  showSuccessModal() {

  }

  showErrorModal() {

  }

  confirmDelete() {
    this.confirmDesactivate();
  }
}
