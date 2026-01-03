// frontend/civicpulse-frontend/src/app/modules/admin/resolution-review-dialog/resolution-review-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-resolution-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './resolution-review-dialog.component.html',
  styleUrls: ['./resolution-review-dialog.component.scss']
})
export class ResolutionReviewDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ResolutionReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  approve() {
    this.dialogRef.close({ action: 'APPROVE' });
  }

  reassign() {
    this.dialogRef.close({ action: 'REASSIGN' });
  }

  close() {
    this.dialogRef.close();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return '';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    console.log('Constructed Image URL:', `${environment.assetUrl}${imagePath}`);
    
    return `${environment.assetUrl}${imagePath}`;
  }
}