import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PassThrough } from 'stream';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule , FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj : any = {
    email : '' , 
    password : ''
  }

  router = inject(Router)

  onLogin() {
    if (this.loginObj.email == 'admin' && this.loginObj.password == '1234') {
      this.router.navigateByUrl('/admin')
    } else {
      alert('Wrong credentials')
    }
  }
}
