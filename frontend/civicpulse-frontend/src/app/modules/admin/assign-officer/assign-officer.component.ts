//frontend/civicpulse-frontend/src/app/modules/admin/assign-officer/assign-officer.component.ts
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
import { OfficerAssignmentService } from '../../../core/services/officer-assignment.service';

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

  grievances: Grievance[] = [];
  officers: any[] = [];
  loading = true;
  selectedGrievance: Grievance | null = null;
  assignForm: FormGroup;
  filteredOfficers: any[] = [];
  filteredGrievances: Grievance[] = [];

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
    private snackBar: MatSnackBar,
    private assignmentService: OfficerAssignmentService
  ) {
    this.assignForm = this.fb.group({
      priority: [null, Validators.required],
      department: ['', Validators.required],
      officerId: [null, Validators.required],
      deadlineDays: [null, Validators.required],
      remarks: ['']
    });

  }

  ngOnInit(): void {
    this.loadPendingGrievances();
    this.loadOfficers();
  }

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

  loadAssignedGrievances(): void {
    const officerId = JSON.parse(localStorage.getItem('currentUser')!).id;

    this.assignmentService.getAssignmentsByOfficer(officerId).subscribe({
      next: (assignments) => {

        this.grievances = assignments.map(a => ({
          ...a.grievance,
          assignmentId: a.id,
          deadline: a.deadline
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


  selectGrievance(grievance: Grievance): void {
    this.selectedGrievance = grievance;
    this.assignForm.reset();
  }

  assignOfficer(): void {
    if (this.assignForm.invalid || !this.selectedGrievance?.id) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const form = this.assignForm.value;

    this.assignmentService.assignOfficer(
      this.selectedGrievance.id,
      form.officerId,
      form.department,
      form.priority,
      form.deadlineDays,
      form.remarks
    ).subscribe({
      next: () => {
        this.snackBar.open('Officer assigned successfully', 'Close', { duration: 3000 });
        this.loadPendingGrievances();
        this.selectedGrievance = null;
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Failed to assign officer', 'Close', { duration: 3000 });
      }
    });
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
  onPriorityChange(priority: string): void {
    let days: number;

    switch (priority) {
      case 'LOW':
        days = 14;
        break;
      case 'MEDIUM':
        days = 5;
        break;
      case 'HIGH':
        days = 2;
        break;
      default:
        days = 5;
    }

    this.assignForm.patchValue({
      deadlineDays: days
    });
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
  onDepartmentChange(department: string) {
    this.filteredOfficers = this.officers.filter(
      officer => officer.department === department
    );

    this.assignForm.patchValue({ officerId: null });
  }
  loadOfficers(): void {
    this.userService.getUsersByRole('OFFICER').subscribe({
      next: (data) => {
        this.officers = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load officers', 'Close', { duration: 3000 });
      }
    });
  }

}
