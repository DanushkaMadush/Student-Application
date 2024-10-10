import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentComponent } from './components/student/student/student.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , StudentComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Student_Application';
}
