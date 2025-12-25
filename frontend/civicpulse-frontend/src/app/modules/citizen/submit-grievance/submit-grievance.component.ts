// src/app/modules/citizen/submit-grievance/submit-grievance.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrievanceService, ComplaintCategory } from '../../../core/services/grievance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-grievance',
  templateUrl: './submit-grievance.component.html',
  styleUrls: ['./submit-grievance.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class SubmitGrievanceComponent implements OnInit {
  grievanceForm: FormGroup;
  categories: ComplaintCategory[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private grievanceService: GrievanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.grievanceForm = this.fb.group({
      categoryId: [null, Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MEDIUM'],
      location: ['', Validators.required],
      latitude: [],
      longitude: []
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.grievanceService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
        console.error('Error loading categories:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.grievanceForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          this.snackBar.open('Location captured successfully', 'Close', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Failed to get location', 'Close', { duration: 3000 });
          console.error('Error getting location:', error);
        }
      );
    } else {
      this.snackBar.open('Geolocation is not supported by this browser', 'Close', { duration: 3000 });
    }
  }

  onSubmit(): void {
    if (this.grievanceForm.invalid) {
      console.log('Submitting grievance payload:', this.grievanceForm.value);
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    this.grievanceService.createGrievance(this.grievanceForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Grievance submitted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/citizen/my-complaints']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open('Failed to submit grievance', 'Close', { duration: 3000 });
        console.error('Error submitting grievance:', err);
      }
    });
  }
}