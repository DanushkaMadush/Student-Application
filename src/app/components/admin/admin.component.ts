import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet , Router, RouterModule } from '@angular/router';
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
    RouterModule,
    FormsModule,
    CommonModule,
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

  downloadFile(studentID: number, fileName: string): void {
    this.http.get(`https://localhost:7244/api/Student/download/${studentID}`, {
      responseType: 'blob'  // Specify the response type as a Blob (binary large object)
    }).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response); // Create a URL for the Blob object
      const a = document.createElement('a');  // Create an anchor element
      a.href = url;
      a.download = fileName;  // Set the file name
      a.click();  // Trigger the download
      window.URL.revokeObjectURL(url);  // Clean up the URL object
    }, error => {
      console.error('Error downloading the file:', error);
    });
  }

  editStudent(student : IStudent) {
    (student as Student).isEditing = true;
  }

  updateStudent(student: IStudent): void {
    const updatedStudent: IStudent = { ...student , license : student.license , approval:student.approval , expiryDate:student.expiryDate };
  
    this.http.put<IStudent>(
      `https://localhost:7244/api/Student/${student.studentID}`,
      updatedStudent
    ).subscribe(
      (response) => {
        console.log('Student updated successfully:', response);
        const index = this.studentList.findIndex(
          (s) => s.studentID === student.studentID
        );
        if (index !== -1) {
          this.studentList[index] = response;
        }
        this.getAllStudents();
      },
      (error) => {
        console.error('Error updating student:', error);
      }
    );
  }

  cancelEdit(student : IStudent) {
    student.isEditing = false;
  }

}
