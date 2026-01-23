import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FilaConferenciaComponent } from './pages/fila-conferencia/fila-conferencia.component';

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
