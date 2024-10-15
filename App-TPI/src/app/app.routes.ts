import { Routes } from '@angular/router';
import { LoginComponent } from './users-login/login.component';
import { LandingPageComponent } from './users-landing-page/landing-page.component';
import { NewUserComponent } from './users-new-user/new-user.component'; 
import { ListUsersComponent } from './users-list-users/list-users.component';
import { UsersUpdateUserComponent } from './users-update-user/users-update-user.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'home',
        component: LandingPageComponent,
        children:[
            {
                path: 'users',
                children: [
                    {
                        path: 'add',
                        component: NewUserComponent
                    },
                    {
                        path: 'list',
                        component: ListUsersComponent   
                    },
                    {
                        path: 'edit/:id',
                        component: UsersUpdateUserComponent
                
                    }

                ]


            }
        ]
    }
];
