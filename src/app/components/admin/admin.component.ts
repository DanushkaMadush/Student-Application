import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StudentComponent } from '../student/student/student.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/class/student';
import { StudentService } from '../../services/student.service';
import { APIResponseModel } from '../../models/response';
import { HttpClient } from '@angular/common/http';
import { IStudent } from '../../models/interface/student.interface';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, StudentComponent, RouterLink, FormsModule, CommonModule , MatIconModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  studentObj: Student = new Student();
  studentList: IStudent[] = [];
  studentService = inject(StudentService);
  isLoader: boolean = true;

  http = inject(HttpClient); 

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents() {
    this.http.get<IStudent[]>("https://localhost:7244/api/Student").subscribe({
      next: (res) => {
        this.studentList = res;
        this.isLoader = false;  // Assuming you want to hide the loader once the data is fetched
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.isLoader = false;  // Hide the loader even on error
      }
    });
  }
}
