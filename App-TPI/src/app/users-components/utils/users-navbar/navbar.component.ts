import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SideButton } from '../../../users-models/SideButton';
import { UsersSideButtonComponent } from "../users-side-button/users-side-button.component";
import { LoginService } from '../../../users-servicies/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, UsersSideButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  //Expande el side
  expand: boolean = false;

  constructor(private router: Router) { }
  private readonly loginService = inject(LoginService);

  userRoles: string[] = this.loginService.getUserRoles()!; 
  userRole: string = "SuperAdmin" //Cambiar según el rol del usuario que se loguee

  //Lista de botones
  buttonsList: SideButton[] = [];

  async ngOnInit (): Promise<void> {
    console.log(this.userRoles);
    
    this.buttonsList = [
      {
        icon: "bi-person",
        title: "Perfil",
        route: "/profile",
        roles: ["SuperAdmin", "Admin", "Security", "Owner", "Spouse", "FamilyOld", "FamilyYoung", "Tenant"] //ver
      },
      {
        icon: "bi-people",
        title: "Usuarios",
        roles: ["SuperAdmin", "Admin", "Owner"],
        childButtons: [{

          //botón agregar usuario
          icon: "bi-person-plus-fill",
          title: "Añadir",
          route: "home/users/add",
          roles: ["SuperAdmin", "Admin", "Owner"]
        },
        {

          //botón listado
          icon: "bi-person-lines-fill",
          title: "Listado",
          route: "home/users/list",
          roles: ["SuperAdmin", "Admin", "Owner"]
        }
        ]
      },
      {
        icon: "bi-houses",
        title: "Usuarios",
        roles: ["SuperAdmin", "Admin"],
        childButtons: [{
          icon: "bi-house-add",
          title: "Añadir Lote",
          route: "home/plots/add",
          roles: ["SuperAdmin", "Admin"]
        },
        {
          icon: "bi-house-gear-fill",
          title: "Listado de Lote",
          route: "home/plots/list",
          roles: ["SuperAdmin", "Admin"]
        }],

      },
      {
        icon: "bi-key-fill",
        title: "Añadir Dueño",
        route: "home/owner/add",
        roles: ["SuperAdmin", "Admin"]
      }

    ];
  }

  //Expandir y contraer el sidebar
  changeState() {
    this.expand = !this.expand;
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }

}