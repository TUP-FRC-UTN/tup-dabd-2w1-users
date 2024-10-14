import { Component, Input } from '@angular/core';
import { SideButton } from '../models/SideButton';
import { empty } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-side-button',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './users-side-button.component.html',
  styleUrl: './users-side-button.component.css'
})
export class UsersSideButtonComponent {
  @Input() expanded : boolean = false;
  @Input() info : SideButton = new SideButton();

  constructor(private route : Router){
  }

  redirect(path : string){
    this.route.navigate([path]);
  }
}
