import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SideButton } from '../../../users-models/SideButton';
import { UsersSideButtonComponent } from "../users-side-button/users-side-button.component";
import { LoginService } from '../../../users-servicies/login.service';
import { AuthService } from '../../../users-servicies/auth.service';

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
  pageTitle : string = "Página Principal"

  constructor(private router: Router) { }
  private readonly authService = inject(AuthService);

  userRoles: string[] =  this.authService.getUser().roles!; 

  //Lista de botones
  buttonsList: SideButton[] = [];

  setName(){
    return this.authService.getUser().name + " " + this.authService.getUser().lastname;
  }

  async ngOnInit (): Promise<void> {    
    this.buttonsList = [
      // {
      //   icon: "bi-person",
      //   title: "Perfil",
      //   route: "home/profile",
      //   roles: ["SuperAdmin", "Admin", "Security", "Owner", "Spouse", "FamilyOld", "FamilyYoung", "Tenant"] //ver
      // },
      {
         //botón grupo familiar
        icon: "bi bi-house",
        title: "Grupo Familiar",
        route: "home/family",
        roles: ["Owner"]
      },
      {
        icon: "bi-people",
        title: "Usuarios",
        roles: ["SuperAdmin", "Admin"],
        childButtons: [{

          //botón agregar usuario
          icon: "bi-person-plus-fill",
          title: "Añadir",
          route: "home/users/add",
          roles: ["SuperAdmin", "Admin"]
        },
        {

          //botón listado
          icon: "bi-person-lines-fill",
          title: "Listado",
          route: "home/users/list",
          roles: ["SuperAdmin", "Admin"]
        }
        ]
      },
      {
        icon: "bi-houses",
        title: "Lotes",
        roles: ["SuperAdmin", "Admin"],
        childButtons: [{
          icon: "bi-house-add",
          title: "Añadir",
          route: "home/plots/add",
          roles: ["SuperAdmin", "Admin"]
        },
        {
          icon: "bi-house-gear-fill",
          title: "Listado",
          route: "home/plots/list",
          roles: ["SuperAdmin", "Admin"]
        }],

      },
      {
        icon: "bi-key-fill",
        title: "Propietario",
        roles: ["SuperAdmin", "Admin"],
        childButtons: [
          {
            icon: "bi-key-fill",
            title: "Añadir",
            route: "home/owners/add",
            roles: ["SuperAdmin", "Admin"]
          },
          {
            icon: "bi-key-fill",
            title: "Lista",
            route: "home/owners/list",
            roles: ["SuperAdmin", "Admin"]
          },
          {
            icon: "bi-key-fill",
            title: "Editar",
            route: "home/owners/edit/:id",
            roles: ["SuperAdmin", "Admin"]
          }
        ]
      }

    ];
  }

  //Expandir y contraer el sidebar
  changeState() {
    this.expand = !this.expand;
  }

  redirect(path: string) {
    if(path === '/login'){
      this.authService.logOut();
      this.router.navigate([path]);
    }
    else{
      this.router.navigate([path]);
    }
  }

  setTitle(title : string){
    this.pageTitle = title;
  }

}