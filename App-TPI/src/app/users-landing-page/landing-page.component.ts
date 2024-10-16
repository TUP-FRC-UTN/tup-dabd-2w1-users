import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from "../users-navbar/navbar.component";
import { ModalInfoUserComponent } from '../users-modal-info-user/modal-info-user.component';
import { RouterOutlet } from '@angular/router';
import { UsersSelectMultipleComponent } from '../users-select-multiple/users-select-multiple.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterOutlet, ModalInfoUserComponent, NavbarComponent, UsersSelectMultipleComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {


}
