import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteStateService } from '../../services/route-state.service';

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
  showHeader$: Observable<boolean>;
  title$: Observable<string>;

  constructor(private routeState: RouteStateService) {
    this.showHeader$ = this.routeState.isLoginRoute$.pipe(
      map((isLogin) => !isLogin),
    );
    this.title$ = this.routeState.routeTitle$;
  }

  logout() {
    console.log('logout');
  }

  toggleTheme() {
    console.log('toggle theme');
  }
}
