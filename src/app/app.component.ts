import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { map, Observable } from 'rxjs';
import { RouteStateService } from './services/route-state/route-state.service';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showContainer$: Observable<boolean>;

  constructor(private routeState: RouteStateService) {
    this.showContainer$ = this.routeState.isLoginRoute$.pipe(
      map((isLogin) => !isLogin),
    );
  }
}
