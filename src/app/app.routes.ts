import { Routes } from '@angular/router';
import { StudentComponent } from './components/student/student/student.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path : '',
        redirectTo : 'student',
        pathMatch : 'full'
    },
    {
        path : 'login',
        component : LoginComponent
    },
    {
        path : 'student',
        component : StudentComponent
    },

    {
        path : 'admin',
        component : AdminComponent
    },
];
