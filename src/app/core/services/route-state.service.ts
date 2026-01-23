import { Injectable } from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  private _isLoginRoute$ = new BehaviorSubject<boolean>(false);
  public isLoginRoute$ = this._isLoginRoute$.asObservable();

  private _routeTitle$ = new BehaviorSubject<string>('');
  public routeTitle$ = this._routeTitle$.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        const currentSnapshot = this.getDeepestChild(
          this.router.routerState.snapshot.root,
        );

        this._isLoginRoute$.next(
          currentSnapshot.url
            .map((u) => u.path)
            .join('/')
            .startsWith('login'),
        );

        const title = currentSnapshot?.['title'] ?? '';
        this._routeTitle$.next(title);
      });
  }

  public isLoginRoute(): boolean {
    return this._isLoginRoute$.value;
  }

  public getRouteTitle(): string {
    return this._routeTitle$.value;
  }

  private getDeepestChild(
    snapshot: ActivatedRouteSnapshot,
  ): ActivatedRouteSnapshot {
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    return snapshot;
  }
}
