import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  registerData = {
    name: '',
    email: '',
    password: '',
    role:'',
    department: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.registerData.role === 'OFFICER' && !this.registerData.department) {
    alert('Please select a department');
    return;
  }
    this.authService.signup(this.registerData).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => alert('Created account successfully! Please login.')
    });
  }
}
