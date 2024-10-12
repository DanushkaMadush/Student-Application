import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet , Router, RouterModule , Routes } from '@angular/router';
import { StudentComponent } from '../student/student/student.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/class/student';
import { StudentService } from '../../services/student.service';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../../models/interface/student.interface';
import { debounceTime } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
  searchTerm : string = '';
  selectedApproval: string = '';
  selectedCountry: string = '';
  selectedInstitute: string = '';
  selectedIntake: string = '';

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents() {
    this.http.get<IStudent[]>(`${environment.API_URL}Student/all`).subscribe({
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

  getSearchStudents(searchTerm: string = '') {
    this.http.get<IStudent[]>(`${environment.API_URL}Student/search?searchTerm=${searchTerm}`).subscribe({
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
        `${environment.API_URL}Student/${student.studentID}`,
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
        `${environment.API_URL}Student/${student.studentID}`,
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

  downloadFile(filePath: string): void {

    const fileName = filePath.split('\\').pop();
    if (!fileName) {
      console.error('File name could not be extracted from the file path.');
      return; 
    }

    this.http.get(`${environment.API_URL}Student/download/${fileName}`, {
      responseType: 'blob'  
    }).subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response); 
      const a = document.createElement('a'); 
      a.href = url;
      a.download = fileName; 
      document.body.appendChild(a); 
      a.click(); 
      document.body.removeChild(a); 
      window.URL.revokeObjectURL(url); 
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
      `${environment.API_URL}Student/${student.studentID}`,
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

  applyFilters() {
    this.getFilteredStudents(this.selectedApproval, this.selectedCountry, this.selectedInstitute, this.selectedIntake);
  }

  resetFilters() {
    this.selectedApproval = '';
    this.selectedCountry = '';
    this.selectedInstitute = '';
    this.selectedIntake = '';
    this.getAllStudents();
  }

  getFilteredStudents(approval?: string, country?: string, institute?: string, intake?: string) {
    let query = `${environment.API_URL}Student/filterStudent?`;

    if (approval) {
      query += `approval=${approval}&`;
    }
    if (country) {
      query += `country=${country}&`;
    }
    if (institute) {
      query += `institute=${institute}&`;
    }
    if (intake) {
      query += `intake=${intake}&`;
    }

    query = query.slice(0, -1);

    this.http.get<IStudent[]>(query).subscribe({
      next: (res) => {
        this.studentList = res;
      },
      error: (error) => {
        console.error('Error fetching filtered students:', error);
      },
    });
  }

}
