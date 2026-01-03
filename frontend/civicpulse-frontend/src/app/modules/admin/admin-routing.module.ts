// frontend/civicpulse-frontend/src/app/modules/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignOfficerComponent } from './assign-officer/assign-officer.component';
import { ResolutionReviewComponent } from './resolution-review/resolution-review.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'assign-officer', component: AssignOfficerComponent },
  { path: 'resolution-review', component: ResolutionReviewComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }