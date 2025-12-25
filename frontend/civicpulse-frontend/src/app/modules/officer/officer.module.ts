// src/app/modules/officer/officer.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSpinner } from '@angular/material/progress-spinner';

import { OfficerRoutingModule } from './officer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignedGrievancesComponent } from './assigned-grievances/assigned-grievances.component';

@NgModule({
  declarations: [], // Remove all component declarations
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    MatSpinner,
    OfficerRoutingModule,
    DashboardComponent, // Import standalone components
    AssignedGrievancesComponent
  ]
})
export class OfficerModule { }