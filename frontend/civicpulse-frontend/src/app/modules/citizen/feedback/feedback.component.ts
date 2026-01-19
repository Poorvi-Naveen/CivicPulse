// frontend/civicpulse-frontend/src/app/modules/citizen/feedback/feedback.component.ts
import { Component, Input, OnInit } from '@angular/core';
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
export class FeedbackComponent implements OnInit {

  resolvedGrievances: any[] = [];

  ratingMap: { [key: number]: number } = {};
  commentsMap: { [key: number]: string } = {};
  successMap: { [key: number]: boolean } = {};
  reopenedMap: { [key: number]: boolean } = {};
  hasFeedbackMap: { [key: number]: boolean } = {};
  //isSubmitting: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private grievanceService: GrievanceService
  ) { }

  ngOnInit(): void {
    this.loadResolvedGrievances();
  }

  // frontend/civicpulse-frontend/src/app/modules/citizen/feedback/feedback.component.ts

  loadResolvedGrievances(): void {
    this.grievanceService.getMyGrievances().subscribe({
      next: (grievances) => {
        console.log('1. All My Grievances:', grievances); // DEBUG

        // Filter purely by status first
        const resolvedCandidates = grievances.filter(g => g.status === 'RESOLVED');
        console.log('2. Candidates (Status=RESOLVED):', resolvedCandidates); // DEBUG

        this.resolvedGrievances = []; // Reset UI

        resolvedCandidates.forEach(g => {
          this.feedbackService.getFeedbackForGrievance(g.id).subscribe({
            next: (existingFeedback) => {
              console.log(`Checking Grievance #${g.id} - Feedback Found?`, existingFeedback); // DEBUG

              // If feedback is NULL or Undefined, show the card
              if (!existingFeedback) {
                this.resolvedGrievances.push(g);
              }
            },
            error: (err) => {
              // If API errors (404), it usually means feedback doesn't exist yet -> SHOW CARD
              console.log(`Grievance #${g.id} has no feedback (Error 404/Empty) -> Showing Card`);
              this.resolvedGrievances.push(g);
            }
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