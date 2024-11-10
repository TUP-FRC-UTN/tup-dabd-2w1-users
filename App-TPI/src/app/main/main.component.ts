import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../users-components/utils/users-navbar/navbar.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
