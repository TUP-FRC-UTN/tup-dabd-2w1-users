import { Routes } from '@angular/router';
import { LoginComponent } from './users-components/utils/users-login/login.component';
import { LandingPageComponent } from './users-components/utils/users-landing-page/landing-page.component';
import { UsersProfileComponent } from './users-components/users/users-profile/users-profile.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './errors-components/not-found/not-found.component';
import { UnauthorizedComponent } from './errors-components/unauthorized/unauthorized.component';
import { roleGuard } from './guards/role.guard';
import { UsersFamiliarGroupComponent } from './users-components/users/users-familiar-group/users-familiar-group.component';
import { UsersRecoveryPasswordComponent } from './users-components/utils/users-recovery-password/users-recovery-password.component';
import { UsersGraphicUserComponent } from './dashboards/users-graphic-user/users-graphic-user.component';
import { UsersGraphicHistogramComponent } from './dashboards/users-graphic-histogram/users-graphic-histogram.component';
import { UsersGraphicBlocksComponent } from './dashboards/users-graphic-blocks/users-graphic-blocks.component';
import { OwnerStatusCountComponent } from './dashboards/owner-status-count/owner-status-count.component';
import { OwnersTaxstatusPercentageComponent } from './dashboards/owners-taxstatus-percentage/owners-taxstatus-percentage.component';
import { MainComponent } from './main/main.component';
import { UsersHomeComponent } from './users-components/utils/users-home/users-home.component';
import { UsersGraphicPlotsStatsComponent } from './dashboards/users-graphic-plots-stats/users-graphic-plots-stats.component';
import { UsersReportComponent } from './dashboards/users-report/users-report.component';

// Rutas principales de la aplicación
export const routes: Routes = [
  {
    //si se deja vacío por defecto redirige al login
    path: '', 
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingPageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    //ruta principal
    path: 'home',
    component: MainComponent,
    canActivate: [authGuard, roleGuard],
    data: {roles : ['SuperAdmin', 'Gerente', 'Propietario']},
    children: [
      {
        //En caso de que sea un botón principal, llamas al component con lazyLoading
        //UsersProfileComponent es mi único componente
        path: 'profile',
        component: UsersProfileComponent,
        data: {roles: ['SuperAdmin', 'Gerente', 'Propietario']}
      },
      {
        path: 'family',
        component: UsersFamiliarGroupComponent,
        data: {roles: ['Propietario', 'Familiar mayor']}
      },
      {
        //En este caso este path tiene componentes hijos, por lo que tengo que llamar al archivo en donde definí sus rutas
        path: 'users',
        data: {roles: ['SuperAdmin', 'Gerente', 'Propietario']},
        loadChildren: () => import('./users-components/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'plots',
        data: {roles: ['SuperAdmin', 'Gerente']},
        loadChildren: () => import('./users-components/plots/plots.module').then(m => m.PlotsModule)
      },
      {
        path: 'owners',
        data: {roles: ['SuperAdmin', 'Gerente']},
        loadChildren: () => import('./users-components/owners/owners.module').then(m => m.OwnersModule)
      },
      {
        path: 'charts/users',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: UsersGraphicUserComponent
      },
      {
        path: 'charts/users/histogram',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: UsersGraphicHistogramComponent
      },
      {
        path: 'charts/users/plots/stats',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: UsersGraphicPlotsStatsComponent
      },
      {
        path: 'charts/users/blocks',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: UsersGraphicBlocksComponent
      },
      {
        path: 'charts/owners/stats',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: OwnerStatusCountComponent
      },
      {
        path: 'charts/owners/taxes',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: OwnersTaxstatusPercentageComponent
      },
      {
        path: 'charts/users/reports',
        data: {roles: ['SuperAdmin', 'Gerente']},
        component: UsersReportComponent
      },
      {
        path: 'start',
        data: {roles: ['SuperAdmin', 'Gerente', 'Propietario','Familiar mayor','Familiar menor','Inquilino']},
        component: UsersHomeComponent
      }
    ]
  },
  {
    path: 'recovery',
    component: UsersRecoveryPasswordComponent
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
