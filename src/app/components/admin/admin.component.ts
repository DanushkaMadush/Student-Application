import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet , Router } from '@angular/router';
import { StudentComponent } from '../student/student/student.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/class/student';
import { StudentService } from '../../services/student.service';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../../models/interface/student.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    StudentComponent,
    RouterLink,
    FormsModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  studentObj: Student = new Student();
  studentList: IStudent[] = [];
  studentService = inject(StudentService);
  isLoader: boolean = true;
  router: Router = new Router;
  http = inject(HttpClient);

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents() {
    this.http.get<IStudent[]>('https://localhost:7244/api/Student').subscribe({
      next: (res) => {
        this.studentList = res;
        this.isLoader = false;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.isLoader = false;
      },
    });
  }

  approveLicense(student: IStudent): void {
    const updatedStudent: IStudent = { ...student, license : 'Active' ,approval: 'Approved' , expiryDate : '2025-03-25' };
    this.http
      .put<IStudent>(
        `https://localhost:7244/api/Student/${student.studentID}`,
        updatedStudent
      )
      .subscribe(
        (response) => {
          console.log('License activate successfully:', response);
          const index = this.studentList.findIndex(
            (s) => s.studentID === student.studentID
          );
          if (index !== -1) {
            this.studentList[index] = response;
          }
          this.getAllStudents();
        },
        (error) => {
          console.error('Error updating license:', error);
        }
      );
  }

  rejectLicense(student: IStudent): void {
    const updatedStudent: IStudent = { ...student, license : 'Inactive' , approval: 'Rejected' , expiryDate : 'N/A' };

    this.http
      .put<IStudent>(
        `https://localhost:7244/api/Student/${student.studentID}`,
        updatedStudent
      )
      .subscribe(
        (response) => {
          console.log('License approved successfully:', response);
          const index = this.studentList.findIndex(
            (s) => s.studentID === student.studentID
          );
          if (index !== -1) {
            this.studentList[index] = response;
          }
          this.getAllStudents();
        },
        (error) => {
          console.error('Error updating license:', error);
        }
      );
  }

}
