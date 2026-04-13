import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth/auth.service';
import { RouteStateService } from '../../../services/route-state/route-state.service';
import { Perfil } from '../../../services/auth/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  hideContainer$: Observable<boolean>;
  title$: Observable<string>;

  constructor(
    private routeState: RouteStateService,
    private router: Router,

    private authService: AuthService,
  ) {
    this.hideContainer$ = this.routeState.hideContainer$.pipe(
      map((hide) => hide),
    );
    this.title$ = this.routeState.routeTitle$;
  }

  nome = this.authService.getUser().nome || '';
  isAdmin = this.authService.getUser().perfil === Perfil.ADMINISTRADOR;

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    console.log('toggle theme');
  }

  usuario() {
    this.router.navigate(['/usuario']);
  }

  filaDeConferencia() {
    this.router.navigate(['/fila-conferencia']);
  }

  redefinirUsuario() {
    this.router.navigate(['/redefinir-usuario']);
  }
}
