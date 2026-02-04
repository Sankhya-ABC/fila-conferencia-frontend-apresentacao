import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(login: LoginRequest): Observable<LoginRequest[]> {
    return this.http.post<LoginRequest[]>('/auths/login', login);
  }
}
