// src/app/modules/officer/assigned-grievances/assigned-grievances.component.ts
import { Component, OnInit } from '@angular/core';
import { GrievanceService, Grievance } from '../../../core/services/grievance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips'; // Add this import
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-assigned-grievances',
  templateUrl: './assigned-grievances.component.html',
  styleUrls: ['./assigned-grievances.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule, // Add this to imports
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSpinner
  ]
})
export class AssignedGrievancesComponent implements OnInit {
  grievances: Grievance[] = [];
  loading = true;
  filteredGrievances: Grievance[] = [];
  statusFilter = 'ALL';
  priorityFilter = 'ALL';
  displayedColumns: string[] = ['id', 'title', 'category', 'location', 'status', 'priority', 'actions'];

  constructor(
    private grievanceService: GrievanceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAssignedGrievances();
  }

  loadAssignedGrievances(): void {
    this.grievanceService.getAllGrievances().subscribe({
      next: (data) => {
        this.grievances = data.filter(g => g.status !== 'RESOLVED' && g.status !== 'REJECTED');
        this.filteredGrievances = [...this.grievances];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Failed to load grievances', 'Close', { duration: 3000 });
        console.error('Error loading grievances:', err);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.grievances];
    
    if (this.statusFilter !== 'ALL') {
      result = result.filter(g => g.status === this.statusFilter);
    }
    
    if (this.priorityFilter !== 'ALL') {
      result = result.filter(g => g.priority === this.priorityFilter);
    }
    
    this.filteredGrievances = result;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'info';
      case 'RESOLVED': return 'success';
      case 'REJECTED': return 'error';
      default: return '';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'info';
      case 'HIGH': return 'warning';
      case 'URGENT': return 'error';
      default: return '';
    }
  }

  updateGrievanceStatus(grievanceId: number, newStatus: string): void {
    this.grievanceService.updateGrievanceStatus(grievanceId, newStatus).subscribe({
      next: (data) => {
        this.snackBar.open(`Grievance status updated to ${newStatus}`, 'Close', { duration: 3000 });
        this.loadAssignedGrievances();
      },
      error: (err) => {
        this.snackBar.open('Failed to update grievance status', 'Close', { duration: 3003 });
        console.error('Error updating grievance status:', err);
      }
    });
  }

  viewGrievanceDetails(id: number): void {
    console.log('Viewing details for grievance ID:', id);
  }
}