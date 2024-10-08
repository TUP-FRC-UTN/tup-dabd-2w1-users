import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ModalInfoUserComponent } from '../modal-info-user/modal-info-user.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ModalInfoUserComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {


}
