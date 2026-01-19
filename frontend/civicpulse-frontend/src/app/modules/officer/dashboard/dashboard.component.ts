// frontend/civicpulse-frontend/src/app/modules/officer/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { OfficerAssignmentService } from '../../../core/services/officer-assignment.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgxChartsModule, PieChartModule, BarChartModule, HeatMapModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, NgxChartsModule, PieChartModule, BarChartModule, HeatMapModule],
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

  statusPieData: any[] = [];
  barData: any[] = [];
  heatMapData: any[] = [];

  colorScheme: Color = {
    name: 'officerScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']
  };

  constructor(
    private assignmentService: OfficerAssignmentService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')!);
    if (user) {
      this.officerName = user.name;
      this.department = user.department;
      this.loadDashboardStats(user.id);
      this.loadChartData(user.id);
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

  loadChartData(officerId: number) {
    this.http.get<any>(`http://localhost:8080/api/assignments/officer/${officerId}/stats`)
      .subscribe({
        next: (data) => {
          console.log('Stats Data Received:', data);
          this.statusPieData = data.byStatus || [];
          this.barData = data.performance;

          this.heatMapData = [{
            "name": "My Zones",
            "series": data.byLocation
          }];
        },
        error: (err) => console.error('Error fetching stats:', err)
      });
  }

  logout() {
    this.authService.logout();
  }
}