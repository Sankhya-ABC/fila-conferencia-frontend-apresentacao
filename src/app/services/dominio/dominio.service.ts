import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodigoDescricao } from './dominio.model';

@Injectable({
  providedIn: 'root',
})
export class DominioService {
  constructor(private http: HttpClient) {}

  getStatus(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/dominios/status');
  }

  getTipoMovimento(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/dominios/tipo-movimento');
  }

  getTipoOperacao(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/dominios/tipo-operacao');
  }

  getTipoEntrega(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/dominios/tipo-entrega');
  }
}
