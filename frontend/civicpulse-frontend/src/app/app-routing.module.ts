import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { DashboardComponent } from './modules/citizen/dashboard/dashboard-citizen.component';
import { DashboardComponent as OfficerDashboard } from './modules/officer/dashboard/dashboard.component';
import { DashboardComponent as AdminDashboard } from './modules/admin/dashboard/dashboard.component';
const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { 
    path: 'citizen/dashboard', 
    component: DashboardComponent, 
  },
  { 
    path: 'officer/dashboard', 
    component: OfficerDashboard 
  },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboard 
  },

  // Fallback for unknown URLs
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
