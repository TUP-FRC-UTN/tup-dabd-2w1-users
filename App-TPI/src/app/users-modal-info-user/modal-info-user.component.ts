import { CommonModule, formatDate } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '../users-models/User';

@Component({
  selector: 'app-modal-info-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-info-user.component.html',
  styleUrl: './modal-info-user.component.css'
})
export class ModalInfoUserComponent implements OnChanges {

  @Input() userModal: UserModel = new UserModel();
  rolesInput: string[] = [];

  // Inicializa el formulario
  editUser = new FormGroup({
    name: new FormControl({ value: this.userModal.name, disabled: true }),
    lastName: new FormControl({ value: this.userModal.lastname, disabled: true }),
    email: new FormControl({ value: this.userModal.email, disabled: true }),
    dni: new FormControl({ value: this.userModal.dni, disabled: true }),
    phoneNumber: new FormControl({ value: this.userModal.phone_number, disabled: true }),
    birthdate: new FormControl({ value: this.userModal.datebirth, disabled: true }),
    roles: new FormControl({ value: this.rolesInput, disabled: true })
  });

  // Método para detectar cambios en el @Input
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['userModal'] && changes['userModal'].currentValue) {
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

}
