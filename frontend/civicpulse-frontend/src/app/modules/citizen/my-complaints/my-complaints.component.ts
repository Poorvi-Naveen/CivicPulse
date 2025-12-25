import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceService, Grievance } from '../../../core/services/grievance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-my-complaints',
  standalone: true,
  templateUrl: './my-complaints.component.html',
  styleUrls: ['./my-complaints.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule
  ]
})
export class MyComplaintsComponent implements OnInit {

  grievances: Grievance[] = [];
  filteredGrievances: Grievance[] = [];
  loading = true;
  statusFilter = 'ALL';

  constructor(
    private grievanceService: GrievanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyGrievances();
  }

  loadMyGrievances(): void {
    this.loading = true;

    this.grievanceService.getMyGrievances().subscribe({
      next: data => {
        this.grievances = data;
        this.filteredGrievances = [...data];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open('Failed to load complaints', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.filteredGrievances =
      status === 'ALL'
        ? [...this.grievances]
        : this.grievances.filter(g => g.status === status);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'IN_PROGRESS': return 'primary';
      case 'RESOLVED': return 'accent';
      case 'REJECTED': return 'warn';
      default: return '';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'LOW': return 'primary';
      case 'MEDIUM': return 'accent';
      case 'HIGH':
      case 'URGENT': return 'warn';
      default: return '';
    }
  }
   viewGrievanceDetails(grievanceId: number): void {
    this.router.navigate(['/citizen/grievance', grievanceId]);
  }

  trackGrievance(grievanceId: number): void {
    this.router.navigate(['/citizen/grievance', grievanceId, 'track']);
  }
}
