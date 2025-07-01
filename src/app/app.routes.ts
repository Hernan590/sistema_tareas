import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: 'login', loadComponent: () => import('./pages/login/login.component')},
    {path: 'panel', loadComponent: () => import('./pages/layout/layout.component'), canActivate: [AuthGuard],
        children: [
            {path: 'dashboard', title: 'Dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component')},
            {path: 'usuarios', title: 'Modulo Usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component')},
            {path: 'tareas', title: 'Modulo Tareas', loadComponent: () => import('./pages/tareas/tareas.component')},
        ]
    },
    { path: '', redirectTo: '/login',pathMatch: 'full'}
];
