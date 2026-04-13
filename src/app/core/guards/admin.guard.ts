import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Perfil } from '../../services/auth/auth.model';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getUser().perfil.toString() !== 'ADMINISTRADOR') {
    return router.createUrlTree(['/fila-conferencia']);
  }

  return true;
};
