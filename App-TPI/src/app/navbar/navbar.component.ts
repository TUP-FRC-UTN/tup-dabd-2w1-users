import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideButton } from '../models/SideButton';
import { UsersSideButtonComponent } from "../users-side-button/users-side-button.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, UsersSideButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  expand: boolean = false;
  //
  buttonsList: SideButton[] = [];

  ngOnInit(): void {
    this.buttonsList = [
      {
        icon : "bi-person",
        title : "Perfil",
        route : "/profile",
        roles : ["SuperAdmin", "Admin", "Security", "Owner"] //ver
      },
      {
        icon : "bi-people",
        title : "Usuarios",
        roles : ["SuperAdmin", "Admin"],
        childButtons: [{

          //botón agregar usuario
          icon : "bi-person-plus-fill",
          title : "Añadir",
          route : "home/users/add",
          roles : ["SuperAdmin", "Admin", "Owner"]
        },
        {

          //botón listado
          icon : "bi-person-lines-fill",
          title : "Listado",
          route : "home/users/list",
          roles : ["SuperAdmin", "Admin", "Owner"]
        }] 
      }
    ]
  }



  //Expandir y contraer el sidebar
  changeState() {
    this.expand = !this.expand;
  }


}