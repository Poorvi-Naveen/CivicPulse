//frontend/civicpulse-frontend/src/app/modules/admin/resolution-review/resolution-review.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceService } from '../../../core/services/grievance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-resolution-review',
  standalone: true,
  templateUrl: './resolution-review.component.html',
  styleUrls: ['./resolution-review.component.scss'],
  imports: [CommonModule, MatCardModule]
})
export class ResolutionReviewComponent implements OnInit {

  grievances: any[] = [];
  selectedResolution: any | null = null;
  loading = true;

  constructor(
    private grievanceService: GrievanceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingReviews();
  }

  loadPendingReviews() {
    this.grievanceService.getPendingResolutionReviews().subscribe({
      next: data => {
        this.grievances = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load resolutions', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  viewResolution(grievanceId: number) {
    this.grievanceService.getResolutionDetails(grievanceId).subscribe(res => {
      this.selectedResolution = res;
    });
  }

  approve(grievanceId: number) {
    this.grievanceService.approveResolution(grievanceId).subscribe(() => {
      this.snackBar.open('Resolution approved', 'Close', { duration: 3000 });
      this.selectedResolution = null;
      this.loadPendingReviews();
    });
  }

  reassign(grievanceId: number) {
    this.grievanceService.reassignGrievance(grievanceId).subscribe(() => {
      this.snackBar.open('Grievance reassigned', 'Close', { duration: 3000 });
      this.selectedResolution = null;
      this.loadPendingReviews();
    });
  }
}
