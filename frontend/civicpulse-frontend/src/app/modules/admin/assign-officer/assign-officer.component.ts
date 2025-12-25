import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { GrievanceService, Grievance } from '../../../core/services/grievance.service';
import { UserService } from '../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-assign-officer',
  standalone: true,
  templateUrl: './assign-officer.component.html',
  styleUrls: ['./assign-officer.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class AssignOfficerComponent implements OnInit {

  // =======================
  // STATE
  // =======================
  grievances: Grievance[] = [];
  officers: any[] = [];
  loading = true;
  selectedGrievance: Grievance | null = null;
  assignForm: FormGroup;

  // 🔴 THIS WAS MISSING
  departments: string[] = [
    'Public Works',
    'Sanitation',
    'Water Supply',
    'Electricity',
    'Health',
    'Traffic Management',
    'Parks and Recreation'
  ];

  constructor(
    private grievanceService: GrievanceService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.assignForm = this.fb.group({
      officerId: [null, Validators.required],
      department: ['', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.loadPendingGrievances();
    this.loadOfficers();
  }

  // =======================
  // DATA LOADERS
  // =======================
  loadPendingGrievances(): void {
    this.grievanceService.getGrievancesByStatus('PENDING').subscribe({
      next: data => {
        this.grievances = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open('Failed to load grievances', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  loadOfficers(): void {
    this.userService.getUsersByRole('OFFICER').subscribe({
      next: data => (this.officers = data),
      error: err => {
        this.snackBar.open('Failed to load officers', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }

  // =======================
  // UI ACTIONS
  // =======================
  selectGrievance(grievance: Grievance): void {
    this.selectedGrievance = grievance;
    this.assignForm.reset();
  }

  assignOfficer(): void {
    if (this.assignForm.invalid || !this.selectedGrievance?.id) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.grievanceService
      .updateGrievanceStatus(this.selectedGrievance.id, 'IN_PROGRESS')
      .subscribe({
        next: () => {
          this.snackBar.open('Officer assigned successfully', 'Close', { duration: 3000 });
          this.loadPendingGrievances();
          this.selectedGrievance = null;
        },
        error: err => {
          this.snackBar.open('Failed to update grievance', 'Close', { duration: 3000 });
          console.error(err);
        }
      });
  }

  // =======================
  // 🔴 THESE WERE MISSING
  // =======================
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
      case 'HIGH': return 'warn';
      case 'URGENT': return 'warn';
      default: return '';
    }
  }
}
