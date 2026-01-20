// frontend/civicpulse-frontend/src/app/modules/admin/reports/report-preview/report-preview.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report-preview',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit {

  grievanceId: number;
  reportData: any = null;
  loading = true;
  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<ReportPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private http: HttpClient
  ) {
    this.grievanceId = data.id;
  }

  ngOnInit() {
    this.http.get(`http://localhost:8080/api/reports/preview/${this.grievanceId}`)
      .subscribe({
        next: (data) => {
          this.reportData = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  downloadPdf() {
    this.loading = true;
    this.http.get(`http://localhost:8080/api/reports/download/${this.grievanceId}`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Grievance_Report_${this.grievanceId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Download failed', err);
        this.loading = false;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}