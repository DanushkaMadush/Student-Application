import { Component , inject, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Student } from '../../../models/class/student';
import { StudentService } from '../../../services/student.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule , CommonModule , ReactiveFormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  studentObj : Student = new Student();
  studentList : Student[] = [];
  studentService = inject(StudentService)

  http = inject(HttpClient);

  ngOnInit(): void {
    
  }



  onSaveStudent(form : NgForm) {
      this.http.post("https://localhost:7244/api/Student", this.studentObj)
        .subscribe({
          next: (response) => {
            console.log('Student saved successfully:', response);
            form.resetForm();
          },
          error: (error) => {
            console.error('Error saving student:', error);
          }
        });
    }
  

  onCancel(form : NgForm) {
    if (confirm("Are you sure?")){
      form.resetForm();
    }
  }

}
