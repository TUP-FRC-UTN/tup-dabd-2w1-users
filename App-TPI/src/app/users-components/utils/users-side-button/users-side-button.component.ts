import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SideButton } from '../../../users-models/SideButton';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-side-button',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './users-side-button.component.html',
  styleUrl: './users-side-button.component.css'
})
export class UsersSideButtonComponent{
  //Expandir o cerrar
  @Input() expanded : boolean = false;

  //Botones
  @Input() info : SideButton = new SideButton();

  //Rol del usuario logeado
  @Input() userRoles : string[] = [];

  constructor(private route : Router){
  }

  redirect(path : string){
    this.route.navigate([path]);
  }
}
