import { Routes } from '@angular/router';
import { LoginComponent } from './users-components/utils/users-login/login.component';
import { LandingPageComponent } from './users-components/utils/users-landing-page/landing-page.component';
import { UsersProfileComponent } from './users-components/users/users-profile/users-profile.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './errors-components/not-found/not-found.component';
import { UnauthorizedComponent } from './errors-components/unauthorized/unauthorized.component';
import { roleGuard } from './guards/role.guard';
import { UsersFamiliarGroupComponent } from './users-components/users/users-familiar-group/users-familiar-group.component';

// Rutas principales de la aplicación
export const routes: Routes = [
  {
    //si se deja vacío por defecto redirige al login
    path: '', 
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    //ruta principal
    path: 'home',
    component: LandingPageComponent,
    canActivate: [authGuard, roleGuard],
    data: {roles : ['SuperAdmin', 'Admin', 'Owner', 'Security']},
    children: [
      {
        path: 'profile',
        component: UsersProfileComponent,
        canActivate: [authGuard, roleGuard],
        data: {roles: ['SuperAdmin', 'Admin', 'Owner', 'Security']}
      },
      {
        path: 'family',
        component: UsersFamiliarGroupComponent ,
        canActivate: [authGuard, roleGuard],
        data: {roles: ['Owner', 'User']}
      },
      {
        path: 'users',
        canActivate: [authGuard, roleGuard],
        data: {roles: ['SuperAdmin', 'Admin']},
        loadChildren: () => import('./users-components/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'plots',
        canActivate: [authGuard],
        data: {roles: ['SuperAdmin', 'Admin']},
        loadChildren: () => import('./users-components/plots/plots.module').then(m => m.PlotsModule)
      },
      {
        path: 'owner',
        canActivate: [authGuard, roleGuard],
        data: {roles: ['SuperAdmin', 'Admin']},
        loadChildren: () => import('./users-components/owners/owners.module').then(m => m.OwnersModule)
      }
    ]
  },
  {
    //componente que se muestra cuando el roleGuard da false
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    //ruta no encontrada
    path: '**',
    component: NotFoundComponent
  }
];
