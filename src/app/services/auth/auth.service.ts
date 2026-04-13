import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SESSION_KEYS } from '../../core/session';
import {
  EsqueciMinhaSenhaParams,
  LoginRequest,
  SessionData,
  RedefinirSenhaParams,
} from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  esqueciMinhaSenha(body: EsqueciMinhaSenhaParams): Observable<null> {
    return this.http.post<null>('/auths/esqueci-minha-senha', body, {
      headers: { 'x-show-success': 'true' },
    });
  }

  redefinirSenha(body: RedefinirSenhaParams): Observable<null> {
    return this.http.post<null>('/auths/redefinir-senha', body);
  }

  login(body: LoginRequest): Observable<SessionData> {
    return this.http.post<SessionData>('/auths/login', body).pipe(
      tap((resp) => {
        localStorage.setItem(SESSION_KEYS.AUTH_USER, JSON.stringify(resp));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEYS.AUTH_USER);
    this.router.navigate(['/login']);
  }

  getUser(): SessionData {
    return JSON.parse(localStorage.getItem(SESSION_KEYS.AUTH_USER) || '{}');
  }

  isAuthenticated(): boolean {
    return !!this.getUser().token;
  }
}
