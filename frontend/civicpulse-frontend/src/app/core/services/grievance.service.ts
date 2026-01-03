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
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
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

  // Grievance methods
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
      { status } // ✅ JSON object
    );
  }


  // Category methods
  getAllCategories(): Observable<ComplaintCategory[]> {
    return this.http.get<ComplaintCategory[]>(this.categoriesUrl);
  }

  createCategory(category: ComplaintCategory): Observable<ComplaintCategory> {
    return this.http.post<ComplaintCategory>(this.categoriesUrl, category);
  }
  getMyGrievances(): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(`${this.apiUrl}/my`);
  }

  // ADMIN: grievances waiting for resolution review
  getPendingResolutionReviews() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/grievances/pending-review`
    );
  }

  // ADMIN: fetch officer resolution details
  getResolutionDetails(grievanceId: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/assignments/grievance/${grievanceId}/resolution`
    );
  }

  // ADMIN: approve resolution
  approveResolution(grievanceId: number) {
    return this.http.put(
      `${environment.apiUrl}/grievances/${grievanceId}/approve`,
      {}
    );
  }

  // ADMIN: reassign grievance
  reassignGrievance(grievanceId: number) {
    return this.http.put(
      `${environment.apiUrl}/grievances/${grievanceId}/reassign`,
      {}
    );
  }

}