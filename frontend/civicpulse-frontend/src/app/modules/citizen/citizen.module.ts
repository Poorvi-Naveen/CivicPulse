// src/app/modules/citizen/citizen.module.ts
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSpinner } from '@angular/material/progress-spinner';

import { CitizenRoutingModule } from './citizen-routing.module';
import { DashboardComponent } from './dashboard/dashboard-citizen.component';
import { SubmitGrievanceComponent } from './submit-grievance/submit-grievance.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';

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
    MatButtonToggleModule,
    MatSpinner,
    CitizenRoutingModule,
    DashboardComponent, // Import standalone components
    SubmitGrievanceComponent,
    MyComplaintsComponent
  ]
})
export class CitizenModule { }