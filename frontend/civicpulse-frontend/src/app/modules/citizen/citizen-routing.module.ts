// frontend/civicpulse-frontend/src/app/modules/citizen/citizen-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard-citizen.component';
import { SubmitGrievanceComponent } from './submit-grievance/submit-grievance.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'submit-grievance', component: SubmitGrievanceComponent },
  { path: 'my-complaints', component: MyComplaintsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenRoutingModule { }