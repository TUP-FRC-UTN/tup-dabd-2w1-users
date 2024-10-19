import { Routes } from '@angular/router';
import { LoginComponent } from './users-components/utils/users-login/login.component';
import { LandingPageComponent } from './users-components/utils/users-landing-page/landing-page.component';
import { UsersProfileComponent } from './users-components/users/users-profile/users-profile.component';
import { authGuard } from './guards/auth.guard';

// Rutas principales de la aplicación
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
    path: 'home',
    component: LandingPageComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        component: UsersProfileComponent,
        canActivate: [authGuard]
      },
      {
        path: 'users',
        canActivate: [authGuard],
        loadChildren: () => import('./users-components/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'plots',
        canActivate: [authGuard],
        loadChildren: () => import('./users-components/plots/plots.module').then(m => m.PlotsModule)
      },
      {
        path: 'owner',
        canActivate: [authGuard],
        loadChildren: () => import('./users-components/owners/owners.module').then(m => m.OwnersModule)
      }
    ]
  }
];
