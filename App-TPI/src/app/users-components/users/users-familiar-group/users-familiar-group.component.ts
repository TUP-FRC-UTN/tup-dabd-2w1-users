import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../users-servicies/user.service';
import { LoginService } from '../../../users-servicies/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInfoUserComponent } from '../users-modal-info-user/modal-info-user.component';
import { UserGet } from '../../../users-models/users/UserGet';

@Component({
  selector: 'app-users-familiar-group',
  standalone: true,
  imports: [],
  templateUrl: './users-familiar-group.component.html',
  styleUrl: './users-familiar-group.component.css'
})
export class UsersFamiliarGroupComponent implements OnInit {

  constructor(private router: Router,private modal: NgbModal) { }

  private readonly apiService = inject(UserService);
  private readonly loginService = inject(LoginService);

  familyGroup: UserGet[] = [];

  ngOnInit() {
    this.apiService.getUsersByPlotID(1).subscribe({
      next: users => {
        // traer a todos menos al que tenga un rol owner
        this.familyGroup = users.filter(user => !user.roles.includes('Owner'));
        console.log(this.familyGroup);
        
        
      },
      error: error => {
        console.error(error);
      }
    })
  }

  redirectEdit(id: number) {
    this.router.navigate(['/home/users/edit', id]); 
  }

  
  redirectAdd() {
    this.router.navigate(['/home/users/add']); 
  }

  async abrirModal(type: string, userId: number) {
    console.log("Esperando a que userModal se cargue...");
  
    // Espera a que se cargue el usuario seleccionado
    try {
      await this.selectUser(userId);
      console.log("userModal cargado:", this.userModal);
  
      // Una vez cargado, abre el modal
      const modalRef = this.modal.open(ModalInfoUserComponent, { size: 'md', keyboard: false });
      modalRef.componentInstance.typeModal = type; // Pasar el tipo de modal al componente hijo
      modalRef.componentInstance.userModal = this.userModal;

      modalRef.result.then((result) => {        
        $('#myTable').DataTable().ajax.reload();
      });

    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }
  

  userModal: UserGet = new UserGet();
  selectUser(id: number): Promise<UserGet> {
      // Mostrar SweetAlert de tipo 'cargando'
    Swal.fire({
      title: 'Cargando usuario...',
      html: 'Por favor, espera un momento',
      allowOutsideClick: false, // No permitir cerrar la alerta haciendo clic fuera
      didOpen: () => {
        Swal.showLoading(); // Mostrar indicador de carga
      }
    });
    return new Promise((resolve, reject) => {
      this.apiService.getUserById(id).subscribe({
        next: (data: UserGet) => {
          this.userModal = data;
          Swal.close(); // Cerrar SweetAlert
          resolve(data); // Resuelve la promesa cuando los datos se cargan
        },
        error: (error) => {
          console.error('Error al cargar el usuario:', error);
          reject(error); // Rechaza la promesa si ocurre un error
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar el usuario. Por favor, inténtalo de nuevo.'
          });
        }
      });
    });
  }


}
