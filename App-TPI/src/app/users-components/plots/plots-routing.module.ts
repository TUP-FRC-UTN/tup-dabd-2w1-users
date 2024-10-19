import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListOwnersComponent } from '../owners/users-list-owners/users-list-owners.component';
import { UsersNewPlotComponent } from './users-new-plot/users-new-plot.component';
import { UsersUpdatePlotComponent } from './users-update-plot/users-update-plot.component';

const routes: Routes = [
  {path: 'list',component: UsersListOwnersComponent },
  {path: 'add', component: UsersNewPlotComponent},
  {path: 'edit/:id', component: UsersUpdatePlotComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlotsRoutingModule { }
