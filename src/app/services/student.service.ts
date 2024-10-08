import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/class/student';
import { environment } from '../../environments/environment.development';
import { APIResponseModel } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http : HttpClient) { }

  getAllStudents ():Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(environment.API_URL + "Student");
  }

  addStudent (obj : Student):Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>("https://localhost:7244/api/Student" , obj);
  }

}
