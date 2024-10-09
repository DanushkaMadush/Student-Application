import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../../models/class/student';
import { StudentService } from '../../../services/student.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CustomvalidationService } from '../../../services/customvalidation.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit {
  studentObj: Student = new Student();
  studentList: Student[] = [];
  studentService = inject(StudentService);
  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;
  studentForm! : FormGroup;
  http = inject(HttpClient);

  constructor (private fb : FormBuilder , private customValidator : CustomvalidationService) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName : ['' , Validators.required],
      lastName : ['' , Validators.required],
      studentEmail : ['' , [Validators.required , this.customValidator.emailValidator()],],
      phone : ['' , [Validators.required , this.customValidator.numberValidator()],],
      country : ['' , Validators.required],
      institute : ['' , Validators.required],
      intake : ['' , Validators.required],
      courseTitle : ['' , Validators.required],
    });
  }

  onSaveStudent(form: NgForm) {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file before submitting.';
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.studentObj.firstName);
    formData.append('lastName', this.studentObj.lastName);
    formData.append('studentEmail', this.studentObj.studentEmail);
    formData.append('phone', this.studentObj.phone);
    formData.append('address', this.studentObj.address);
    formData.append('country', this.studentObj.country);
    formData.append('institute', this.studentObj.institute);
    formData.append('intake', this.studentObj.intake);
    formData.append('courseTitle', this.studentObj.courseTitle);
    formData.append('file', this.selectedFile); // File

    this.http.post('https://localhost:7244/api/Student', formData).subscribe({
      next: (response) => {
        console.log('Student saved successfully:', response);
        form.resetForm();
        this.successMessage = 'Application submitted successfully!';
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Error saving student:', error);
        if (error.status === 400 && error.error === 'Email already exists.') {
          this.errorMessage = 'This Email is already used. Please use a different email.'
        } else {
          this.errorMessage = 'Oops! Something went wrong. Please try again.';
        }
      },
    });
  }

  onCancel(form: NgForm) {
    if (confirm('Are you sure?')) {
      form.resetForm();
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }
}
