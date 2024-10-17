import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../users-navbar/navbar.component';
import { ModalInfoUserComponent } from '../../users/users-modal-info-user/modal-info-user.component';
import { RouterOutlet } from '@angular/router';
import { UsersSelectMultipleComponent } from '../../utils/users-select-multiple/users-select-multiple.component';
import { UsuariosNewOwnerComponent } from "../../owners/users-new-owner/usuarios-new-owner.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, ModalInfoUserComponent, NavbarComponent, UsersSelectMultipleComponent, UsuariosNewOwnerComponent, UsuariosNewOwnerComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {


}
