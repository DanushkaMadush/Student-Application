import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StudentComponent } from '../student/student/student.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet , StudentComponent , AdminComponent , RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
