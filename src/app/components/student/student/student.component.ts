import { Component , inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../models/class/student';
import { StudentService } from '../../../services/student.service';
import { APIResponseModel } from '../../../models/response';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  studentObj : Student = new Student();
  studentList : Student[] = [];
  studentService = inject(StudentService)

  ngOnInit(): void {
    
  }

  loadStudent () {
    this.studentService.getAllStudents().subscribe((res:APIResponseModel) =>{
      this.studentList = res.data;
    })
  }

  onSaveStudent() {
    debugger;
    this.studentService.addStudent(this.studentObj).subscribe((res:APIResponseModel) => {
      if(res.result) {
        alert("Student created success")
      } else {
        alert(res.message)
      }
    })
  }

}
