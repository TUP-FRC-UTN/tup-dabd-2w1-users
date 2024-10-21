import { Component, inject, ViewChild } from '@angular/core';
import { NavbarComponent } from '../users-navbar/navbar.component';
import { ModalInfoUserComponent } from '../../users/users-modal-info-user/modal-info-user.component';
import { RouterOutlet } from '@angular/router';
import { UsersSelectMultipleComponent } from '../../utils/users-select-multiple/users-select-multiple.component';
import { LoginService } from '../../../users-servicies/login.service';
import { FileService } from '../../../users-servicies/file.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, ModalInfoUserComponent, NavbarComponent, UsersSelectMultipleComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  private readonly file: FileService = inject(FileService);

  downloadTmpFile(): void {
    // Cambia 'fileId123' por el identificador del archivo y 'archivo-descargado.ext' por el nombre y extensión que prefieras
    this.file.downloadFile('88673b48-49c3-4e41-bbf4-20294dde51c9');

  }
}
