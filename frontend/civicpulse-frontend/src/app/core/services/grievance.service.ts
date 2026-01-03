// frontend/civicpulse-frontend/src/app/core/services/grievance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Grievance {
  id?: number;
  userId?: number;
  categoryId?: number;
  categoryName?: string;
  title: string;
  description: string;
  imagePath?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLUTION_SUBMITTED' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplaintCategory {
  categoryId?: number;
  categoryName: string;
  description?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GrievanceService {
  private apiUrl = `${environment.apiUrl}/grievances`;
  private categoriesUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getAllGrievances(): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(this.apiUrl);
  }

  getGrievancesByUser(userId: number): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(`${this.apiUrl}/user/${userId}`);
  }

  getGrievancesByStatus(status: string): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(`${this.apiUrl}/status/${status}`);
  }

  createGrievance(grievance: Grievance): Observable<Grievance> {
    return this.http.post<Grievance>(this.apiUrl, grievance);
  }

  updateGrievanceStatus(grievanceId: number, status: string): Observable<Grievance> {
    return this.http.put<Grievance>(
      `${this.apiUrl}/${grievanceId}/status`,
      { status } 
    );
  }


  getAllCategories(): Observable<ComplaintCategory[]> {
    return this.http.get<ComplaintCategory[]>(this.categoriesUrl);
  }

  createCategory(category: ComplaintCategory): Observable<ComplaintCategory> {
    return this.http.post<ComplaintCategory>(this.categoriesUrl, category);
  }
  getMyGrievances(): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(`${this.apiUrl}/my`);
  }

  getPendingResolutionReviews() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/grievances/pending-review`
    );
  }

  getResolutionDetails(grievanceId: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/assignments/grievance/${grievanceId}/resolution`
    );
  }

  approveResolution(grievanceId: number) {
    return this.http.put(
      `${environment.apiUrl}/grievances/${grievanceId}/approve`,
      {}
    );
  }

  reassignGrievance(grievanceId: number) {
    return this.http.put(
      `${environment.apiUrl}/grievances/${grievanceId}/reassign`,
      {}
    );
  }

}