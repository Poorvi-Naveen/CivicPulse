// frontend/civicpulse-frontend/src/app/core/services/feedback.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private baseUrl = 'http://localhost:8080/api/feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(payload: {
    grievanceId: number;
    rating: number;
    comments: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  getFeedbackForGrievance(grievanceId: number | undefined): Observable<any> {
    if (grievanceId === undefined) {
      throw new Error('Grievance ID is required');
    }
    return this.http.get(`${this.baseUrl}/grievance/${grievanceId}`);
  }
}
