import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { FilaConferenciaComponent } from './features/fila/pages/fila-conferencia/fila-conferencia.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'fila-conferencia',
    title: 'Fila de Conferência',
    component: FilaConferenciaComponent,
  },
  {
    path: '',
    redirectTo: '/fila-conferencia',
    pathMatch: 'full',
  },
];
