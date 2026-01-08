// frontend/civicpulse-frontend/src/app/modules/citizen/feedback/feedback.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../../core/services/feedback.service';
import { GrievanceService } from '../../../core/services/grievance.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {

  resolvedGrievances: any[] = [];

  ratingMap: { [key: number]: number } = {};
  commentsMap: { [key: number]: string } = {};
  successMap: { [key: number]: boolean } = {};
  reopenedMap: { [key: number]: boolean } = {};
  //isSubmitting: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private grievanceService: GrievanceService
  ) { }

  ngOnInit(): void {
    this.loadResolvedGrievances();
  }

  hasFeedbackMap: { [key: number]: boolean } = {};

  loadResolvedGrievances(): void {
    this.grievanceService.getMyGrievances().subscribe({
      next: (grievances) => {
        this.resolvedGrievances = grievances.filter(g => g.status === 'RESOLVED');

        this.resolvedGrievances.forEach(g => {
          this.feedbackService.getFeedbackForGrievance(g.id).subscribe({
            next: () => this.hasFeedbackMap[g.id] = true,
            error: () => this.hasFeedbackMap[g.id] = false
          });
        });
      }
    });
  }


  setRating(grievanceId: number, rating: number): void {
    this.ratingMap[grievanceId] = rating;
  }

  submitFeedback(grievance: any): void {
    const payload = {
      grievanceId: grievance.id,
      rating: this.ratingMap[grievance.id],
      comments: this.commentsMap[grievance.id] || ''
    };

    this.feedbackService.submitFeedback(payload).subscribe(() => {
      this.successMap[grievance.id] = true;
    });
  }

  reopenComplaint(grievanceId: number): void {
    const reason = this.commentsMap[grievanceId];
    if (!reason || reason.trim().length === 0) {
      alert('Please provide a reason in the comments section to reopen this complaint.');
      return;
    }

    if (confirm('Are you sure you want to reopen this complaint? This will be sent to an Admin for review.')) {
      this.grievanceService.reopenComplaint(grievanceId, reason).subscribe({
        next: () => {
          this.reopenedMap[grievanceId] = true;
          // setTimeout(() => this.loadResolvedGrievances(), 2000); 
        },
        error: (err) => {
          console.error(err);
          alert('Failed to reopen complaint. Please try again.');
        }
      });
    }
  }
}