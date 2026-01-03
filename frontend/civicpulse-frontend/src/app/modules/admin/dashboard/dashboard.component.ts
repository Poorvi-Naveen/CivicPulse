// frontend/civicpulse-frontend/src/app/modules/admin/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  today: Date = new Date();

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}