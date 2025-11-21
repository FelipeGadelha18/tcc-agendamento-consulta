import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

    // 👉 Redireciona automaticamente para /login ao iniciar a aplicação
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        loadComponent: () => import('./component/login/login.component')
            .then((m) => m.LoginComponent),
    },

    {
        path: 'cadastro',
        loadComponent: () => import('./component/cadastro/cadastro.component')
            .then((m) => m.CadastroComponent),
    },

    {
        path: 'paciente',
        loadComponent: () => import('./restrito-layout/restrito-layout.component')
            .then((m) => m.RestritoLayoutComponent),
        canActivate: [AuthGuard],
        data: { role: 'PACIENTE' },
        children: [
            {
                path: 'inicio',
                loadComponent: () => import('./component/paciente/home/home.component')
                    .then(m => m.HomeComponent),
            },
        ]
    }
];
