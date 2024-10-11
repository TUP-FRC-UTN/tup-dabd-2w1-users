import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ModalInfoUserComponent } from '../modal-info-user/modal-info-user.component';
import { UsersModalInfoOwnerComponent } from "../users-modal-info-owner/users-modal-info-owner.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ModalInfoUserComponent, UsersModalInfoOwnerComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {


}
