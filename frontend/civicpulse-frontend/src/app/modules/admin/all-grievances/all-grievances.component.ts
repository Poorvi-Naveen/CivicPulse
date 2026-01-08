// frontend/civicpulse-frontend/src/app/modules/admin/all-grievances/all-grievances.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceService, Grievance } from '../../../core/services/grievance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-grievances',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './all-grievances.component.html',
  styleUrls: ['./all-grievances.component.scss']
})
export class AllGrievancesComponent implements OnInit {

  grievances: Grievance[] = [];
  filtered: Grievance[] = [];
  statusFilter = 'ALL';
  rejectionRemark = '';
  loading = true;

  constructor(
    private grievanceService: GrievanceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  loadGrievances(): void {
    this.loading = true;

    this.grievanceService.getAllGrievances().subscribe({
      next: data => {
        this.grievances = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load grievances', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(): void {
    this.filtered =
      this.statusFilter === 'ALL'
        ? [...this.grievances]
        : this.grievances.filter(g => g.status === this.statusFilter);
  }

  approve(grievanceId: Grievance): void {
    if (grievanceId.status === 'REOPENED') {
      // Endpoint for approving a reopen
      this.grievanceService.approveReopen(grievanceId.id!).subscribe(() => {
        this.snackBar.open('Reopen request approved. Moved to Assignment Console.', 'Close', { duration: 3000 });
        this.loadGrievances();
      });
    } else {
    this.grievanceService.updateGrievanceStatus(grievanceId.id!, 'IN_PROGRESS')
      .subscribe(() => {
        this.snackBar.open('Grievance approved', 'Close', { duration: 2000 });
        this.loadGrievances();
      });
    }
  }

  reject(grievanceId: number): void {
    if (!this.rejectionRemark || this.rejectionRemark.length < 5) {
      this.snackBar.open('Please enter a valid rejection remark', 'Close', { duration: 3000 });
      return;
    }

    this.grievanceService.rejectGrievance(grievanceId, this.rejectionRemark)
      .subscribe(() => {
        this.rejectionRemark = '';
        this.snackBar.open('Grievance rejected', 'Close', { duration: 2000 });
        this.loadGrievances();
      });
  }
}