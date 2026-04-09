import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { FilaConferenciaComponent } from './pages/fila-conferencia/fila-conferencia.component';
import { LoginComponent } from './pages/login/login.component';
import { RedefinirSenhaComponent } from './pages/redefinir-senha/redefinir-senha.component';
import { SeparacaoComponent } from './pages/separacao/separacao.component';

export const routes: Routes = [
  {
    canActivate: [loginGuard],
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: 'redefinir-senha',
    component: RedefinirSenhaComponent,
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
