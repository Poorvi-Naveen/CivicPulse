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
import { MatCardModule } from '@angular/material/card';
import { OfficerAssignmentService } from '../../../core/services/officer-assignment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assigned-grievances',
  templateUrl: './assigned-grievances.component.html',
  styleUrls: ['./assigned-grievances.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule,
    MatCardModule,
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
  remarksText: string = '';
  selectedFile: File | null = null;

  constructor(
    private grievanceService: GrievanceService,
    private assignmentService: OfficerAssignmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAssignedGrievances();
  }

  loadAssignedGrievances(): void {
    const officerId = JSON.parse(localStorage.getItem('currentUser')!).id;

    this.assignmentService.getAssignmentsByOfficer(officerId).subscribe({
      next: (data) => {
        this.grievances = data.map(a => ({
          ...a.grievance,
          assignmentId: a.id
        }));

        this.filteredGrievances = [...this.grievances];
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open('Failed to load assigned grievances', 'Close', { duration: 3000 });
        console.error(err);
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

  /*updateGrievanceStatus(grievanceId: number, newStatus: string): void {
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
  }*/

  openSubmitResolution(grievance: any) {

    if (!this.remarksText || this.remarksText.trim().length < 10) {
      this.snackBar.open(
        'Please enter resolution remarks (minimum 10 characters)',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    if (!this.selectedFile) {
      this.snackBar.open(
        'Please upload a proof image before submitting',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    this.assignmentService
      .submitResolution(
        grievance.assignmentId,
        this.remarksText.trim(),
        this.selectedFile
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Resolution submitted for admin review',
            'Close',
            { duration: 3000 }
          );
          this.remarksText = '';
          this.selectedFile = null;
          this.loadAssignedGrievances();
        },
        error: () => {
          this.snackBar.open(
            'Failed to submit resolution',
            'Close',
            { duration: 3000 }
          );
        }
      });
      console.log('Submitting resolution for assignment ID:', grievance.assignmentId);
      console.log('Remarks:', this.remarksText);
      console.log('Selected file:', this.selectedFile);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


  viewGrievanceDetails(id: number): void {
    console.log('Viewing details for grievance ID:', id);
  }
}