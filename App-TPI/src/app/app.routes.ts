import { Routes } from '@angular/router';
import { LoginComponent } from './users-components/utils/users-login/login.component';
import { LandingPageComponent } from './users-components/utils/users-landing-page/landing-page.component';
import { NewUserComponent } from './users-components/users/users-new-user/new-user.component'; 
import { ListUsersComponent } from './users-components/users/users-list-users/list-users.component';
import { UsersUpdateUserComponent } from './users-components/users/users-update-user/users-update-user.component';
import { UsersNewPlotComponent } from './users-components/plots/users-new-plot/users-new-plot.component';
import { UsersListPlotsComponent } from './users-components/plots/users-list-plots/users-list-plots.component';
import { UsersUpdatePlotComponent } from './users-components/plots/users-update-plot/users-update-plot.component';
import { UsuariosNewOwnerComponent } from './users-components/owners/users-new-owner/usuarios-new-owner.component';
import { UsersUpdateOwnerComponent } from './users-components/owners/users-update-owner/users-update-owner.component';
import { UsersListOwnersComponent } from './users-components/owners/users-list-owners/users-list-owners.component';

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
            },
            {
                path: 'plots',
                children: [
                    {
                        path: 'add',
                        component: UsersNewPlotComponent
                    },
                    {
                        path: 'list',
                        component: UsersListPlotsComponent
                    }
                    ,
                    {
                        path: 'edit/:id',
                        component: UsersUpdatePlotComponent
                    }
                ]
            },
            {
                path: 'owner',
                children: [
                    {
                        path: 'add',
                        component: UsuariosNewOwnerComponent
                    },
                    {
                        path: 'edit/:id',
                        component: UsersUpdateOwnerComponent
                    },
                    {
                        path: 'list',
                        component: UsersListOwnersComponent
                    }
                ]
            }
        ]
    }
];
