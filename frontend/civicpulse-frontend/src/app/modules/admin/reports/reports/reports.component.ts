// src/app/modules/admin/reports/reports.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { GrievanceService } from '../../../../core/services/grievance.service';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'category', 'status', 'actions'];
  dataSource: any[] = [];
  
  constructor(
    private grievanceService: GrievanceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGrievances();
  }

  loadGrievances() {
    this.grievanceService.getAllGrievances().subscribe({
      next: (data) => {
        this.dataSource = data.sort((a: any, b: any) => b.id - a.id);
      },
      error: (err) => console.error('Error loading grievances', err)
    });
  }

  openReportPreview(grievanceId: number) {
    this.dialog.open(ReportPreviewComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { id: grievanceId },
      autoFocus: false
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value; 
  }
}