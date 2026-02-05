import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { FilaConferenciaComponent } from './pages/fila-conferencia/fila-conferencia.component';
import { LoginComponent } from './pages/login/login.component';
import { SeparacaoComponent } from './pages/separacao/separacao.component';

export const routes: Routes = [
  {
    canActivate: [loginGuard],
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    canActivate: [authGuard],
    path: 'fila-conferencia',
    title: 'Fila de Conferência',
    component: FilaConferenciaComponent,
  },
  {
    canActivate: [authGuard],
    path: 'separacao/:numeroUnico',
    title: 'Separação',
    component: SeparacaoComponent,
  },
  {
    path: '',
    redirectTo: '/fila-conferencia',
    pathMatch: 'full',
  },
];
