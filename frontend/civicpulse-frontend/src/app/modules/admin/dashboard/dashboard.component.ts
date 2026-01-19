// frontend/civicpulse-frontend/src/app/modules/admin/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PieChartModule, BarChartModule, HeatMapModule, Color, ScaleType } from '@swimlane/ngx-charts';

import { GrievanceService, Grievance } from '../../../core/services/grievance.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, PieChartModule, BarChartModule, HeatMapModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  
  today: Date = new Date();

  totalCitizens: number = 0;
  totalGrievances: number = 0;
  resolvedCount: number = 0;
  pendingCount: number = 0;

  pieData: any[] = [];
  barData: any[] = [];
  heatMapData: any[] = [];

  view: [number, number] = [700, 300];
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: Color = {
    name: 'civic',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#1f77b4']
  };
  
  departmentStats: any[] = [];
  colors: string[] = ['blue-fill', 'orange-fill', 'green-fill', 'purple-fill', 'red-fill'];

  constructor(
    private authService: AuthService,
    private grievanceService: GrievanceService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadChartData();
  }

  loadData() {
    this.userService.getUsersByRole('CITIZEN').subscribe({
      next: (users) => this.totalCitizens = users.length,
      error: () => this.totalCitizens = 0
    });

    this.grievanceService.getAllGrievances().subscribe({
      next: (data) => {
        this.totalGrievances = data.length;

        this.resolvedCount = data.filter(g => g.status === 'RESOLVED').length;

        this.pendingCount = data.filter(g => 
          ['PENDING', 'REOPENED', 'APPROVED'].includes(g.status)
        ).length;
        this.calculateDepartmentStats(data);
      }
    });
  }

  calculateDepartmentStats(grievances: Grievance[]) {
    const statsMap = new Map<string, { total: number, resolved: number }>();

    grievances.forEach(g => {
      const cat = g.categoryName || 'Uncategorized';
      if (!statsMap.has(cat)) {
        statsMap.set(cat, { total: 0, resolved: 0 });
      }
      
      const entry = statsMap.get(cat)!;
      entry.total++;
      if (g.status === 'RESOLVED') {
        entry.resolved++;
      }
    });

    let index = 0;
    this.departmentStats = [];
    
    statsMap.forEach((value, key) => {
      const percentage = value.total > 0 
        ? Math.round((value.resolved / value.total) * 100) 
        : 0;

      this.departmentStats.push({
        name: key,
        percentage: percentage,
        colorClass: this.colors[index % this.colors.length] 
      });
      index++;
    });
  }

  loadChartData() {
    this.http.get<any>('http://localhost:8080/api/admin/dashboard/stats').subscribe(stats => {
      
      this.pieData = stats.categoryDistribution;
      this.barData = stats.slaPerformance;
      this.heatMapData = [
        {
          "name": "Complaint Intensity",
          "series": stats.zoneHeatmap
        }
      ];
    });
  }

  logout() {
    this.authService.logout();
  }
}