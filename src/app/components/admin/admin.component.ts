import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StudentComponent } from '../student/student/student.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/class/student';
import { StudentService } from '../../services/student.service';
import { APIResponseModel } from '../../models/response';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet , StudentComponent , AdminComponent , RouterLink , FormsModule , CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  studentObj : Student = new Student();
  studentList : Student[] = [];
  studentService = inject(StudentService);
  isLoader : boolean = true;

  ngOnInit(): void {
    this.loadStudent();
  }

  trackByStudentID(index: number, student: Student): number {
    return student.studentID;
  }

  loadStudent () {
    this.studentService.getAllStudents().subscribe((res:APIResponseModel) =>{
      this.studentList = res.data;
    })
  }
}
