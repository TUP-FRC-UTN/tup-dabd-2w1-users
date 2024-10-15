import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./users-login/login.component";
import { NavbarComponent } from "./users-navbar/navbar.component";
import { LandingPageComponent } from "./users-landing-page/landing-page.component";
import { NewUserComponent } from './users-new-user/new-user.component';
import { ListUsersComponent } from './users-list-users/list-users.component';
import { ModalInfoUserComponent } from './users-modal-info-user/modal-info-user.component';
import { UsersNewPlotComponent } from './users-new-plot/users-new-plot.component';
import { UsersUpdateUserComponent } from './users-update-user/users-update-user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent, LandingPageComponent, NewUserComponent, ListUsersComponent, ModalInfoUserComponent, UsersNewPlotComponent, UsersUpdateUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LoginTpi';
  showLoginPage : boolean = true;
  showLandingPage : boolean = false;
  showAddUserPage : boolean = false;
  showListUsersPage : boolean = false;

  redirect(page : any){
    this.showLandingPage = false;
    this.showLoginPage = false;
    this.showAddUserPage = false;
    this.showListUsersPage = false;

    if(page == "Login"){
      this.showLoginPage = !this.showLoginPage;
    }
    if(page == "Landing"){
      this.showLandingPage = !this.showLandingPage;
    }
    if(page == "ListUsers"){
      this.showListUsersPage = !this.showListUsersPage;
    }
    if(page == "AddUser"){
      this.showAddUserPage = !this.showAddUserPage;
    }
  }
}
