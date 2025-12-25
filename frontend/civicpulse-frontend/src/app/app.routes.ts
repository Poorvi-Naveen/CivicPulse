import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { AuthGuard } from './modules/auth/auth.guard'; 

export const routes: Routes = [
  // Public routes
  { 
    path: 'auth', 
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  
  // Protected routes with role-based access
  { 
    path: 'citizen', 
    loadChildren: () => import('./modules/citizen/citizen.module').then(m => m.CitizenModule),
    canActivate: [AuthGuard], 
    data: { roles: ['CITIZEN'] }
  },
  { 
    path: 'officer', 
    loadChildren: () => import('./modules/officer/officer.module').then(m => m.OfficerModule),
    canActivate: [AuthGuard],
    data: { roles: ['OFFICER'] }
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  
  // Default routes
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];