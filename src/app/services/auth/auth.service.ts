import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SESSION_KEYS } from '../../core/session';
import { LoginRequest, LoginResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auths/login', body).pipe(
      tap((resp) => {
        localStorage.setItem(SESSION_KEYS.AUTH_USER, JSON.stringify(resp));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEYS.AUTH_USER);
    this.router.navigate(['/login']);
  }

  getUser(): LoginResponse {
    return JSON.parse(localStorage.getItem(SESSION_KEYS.AUTH_USER) || '{}');
  }

  isAuthenticated(): boolean {
    return !!this.getUser().token;
  }
}
