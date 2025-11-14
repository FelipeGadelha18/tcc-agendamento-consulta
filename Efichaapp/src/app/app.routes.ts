import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'login',
        loadComponent: () => import('./component/login/login.component').then((m) => m.LoginComponent),
    },

    // {
    //     path: 'paciente',
    //     loadComponent
    // }
];
