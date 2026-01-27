import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FilaConferenciaComponent } from './pages/fila-conferencia/fila-conferencia.component';
import { SeparacaoComponent } from './pages/separacao/separacao.component';

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
    path: 'separacao/:numeroNota',
    title: 'Separação',
    component: SeparacaoComponent,
  },
  {
    path: '',
    redirectTo: '/fila-conferencia',
    pathMatch: 'full',
  },
];
