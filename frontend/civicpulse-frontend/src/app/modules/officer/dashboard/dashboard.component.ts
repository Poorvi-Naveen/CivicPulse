// frontend/civicpulse-frontend/src/app/modules/officer/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { OfficerAssignmentService } from '../../../core/services/officer-assignment.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss' // Note: styleUrl is singular in Angular 17+
})
export class DashboardComponent implements OnInit {

  totalAssigned = 0;
  inProgress = 0;
  highPriority = 0;
  awaitingReview = 0;

  officerName = '';
  department = '';

  constructor(
    private assignmentService: OfficerAssignmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')!);
    if (user) {
      this.officerName = user.name;
      this.department = user.department;
      this.loadDashboardStats(user.id);
    }
  }

  loadDashboardStats(officerId: number): void {
    this.assignmentService.getAssignmentsByOfficer(officerId).subscribe(assignments => {

      // Deduplicate by grievance
      const latestByGrievance = new Map<number, any>();

      assignments.forEach(a => {
        latestByGrievance.set(a.grievance.id, a.grievance);
      });

      const grievances = Array.from(latestByGrievance.values());

      this.totalAssigned = grievances.length;
      this.inProgress = grievances.filter(g => g.status === 'IN_PROGRESS').length;
      this.awaitingReview = grievances.filter(g => g.status === 'RESOLUTION_SUBMITTED').length;
      this.highPriority = grievances.filter(
        g => g.priority === 'HIGH' || g.priority === 'URGENT'
      ).length;
    });
  }

  logout() {
    this.authService.logout();
  }
}