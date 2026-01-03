import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrievanceService } from '../../../core/services/grievance.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // Added for styling
import { MatIconModule } from '@angular/material/icon'; // Added for styling
import { ResolutionReviewDialogComponent } from '../resolution-review-dialog/resolution-review-dialog.component';


@Component({
  selector: 'app-resolution-review',
  standalone: true,
  templateUrl: './resolution-review.component.html',
  styleUrls: ['./resolution-review.component.scss'],
  // Added MatButtonModule and MatIconModule for the new UI elements
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule]
})
export class ResolutionReviewComponent implements OnInit {

  grievances: any[] = [];
  selectedResolution: any | null = null;
  loading = true;

  constructor(
    private grievanceService: GrievanceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

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

      const dialogRef = this.dialog.open(
        ResolutionReviewDialogComponent,
        {
          width: '900px',
          maxHeight: '90vh',
          data: res
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        if (!result) return;

        if (result.action === 'APPROVE') {
          this.approve(grievanceId);
        }

        if (result.action === 'REASSIGN') {
          this.reassign(grievanceId);
        }
      });
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