import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    role: '' 
  };

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        const userRole = response.role;

        let dashboardPath = '';
        if (userRole === 'ADMIN') {
          dashboardPath = '/admin/dashboard';
        } else if (userRole === 'OFFICER') {
          dashboardPath = '/officer/dashboard';
        } else {
          dashboardPath = '/citizen/dashboard';
        }
        
        this.router.navigate([dashboardPath]);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Invalid Credentials');
      }
    });
  }
}