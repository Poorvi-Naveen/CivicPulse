// frontend/civicpulse-frontend/src/app/core/services/officer-assignment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OfficerAssignmentService {

  private apiUrl = `${environment.apiUrl}/assignments`;

  constructor(private http: HttpClient) { }

  getAssignmentsByOfficer(officerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/officer/${officerId}`);
  }

  assignOfficer(
    grievanceId: number,
    officerId: number,
    department: string,
    priority: string,
    deadlineDays: number,
    remarks: string
  ) {
    const params = {
      grievanceId,
      officerId,
      department,
      priority,
      deadlineDays: deadlineDays.toString()
    };

    return this.http.post(
      this.apiUrl,
      null,
      { params }
    );
  }


  submitResolution(
    assignmentId: number,
    remarks: string,
    proofImage?: File
  ) {
    const formData = new FormData();
    formData.append('remarks', remarks);

    if (proofImage) {
      formData.append('proofImage', proofImage);
    }

    return this.http.put(
      `${this.apiUrl}/${assignmentId}/submit-resolution`,
      formData
    );
  }

}
