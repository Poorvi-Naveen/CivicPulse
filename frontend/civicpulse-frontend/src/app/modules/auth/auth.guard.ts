// src/app/modules/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();
      
      // Check if user is trying to access the correct dashboard
      const currentPath = window.location.pathname;
      
      if (userRole) {
        if (currentPath.startsWith('/citizen') && userRole !== 'CITIZEN') {
          this.router.navigate([this.getDashboardPath(userRole)]);
          return false;
        }
        
        if (currentPath.startsWith('/officer') && userRole !== 'OFFICER') {
          this.router.navigate([this.getDashboardPath(userRole)]);
          return false;
        }
        
        if (currentPath.startsWith('/admin') && userRole !== 'ADMIN') {
          this.router.navigate([this.getDashboardPath(userRole)]);
          return false;
        }
      }
      
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  private getDashboardPath(role: string): string {
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'OFFICER': return '/officer/dashboard';
      default: return '/citizen/dashboard';
    }
  }
}
