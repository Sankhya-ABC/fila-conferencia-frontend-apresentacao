import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodigoDescricao } from '../dto/dominio.model';
import {
  FilaConferenciaDTO,
  FilaConferenciaFilter,
} from './fila-conferencia.model';

@Injectable({
  providedIn: 'root',
})
export class FilaConferenciaService {
  constructor(private http: HttpClient) {}

  getFilaConferencias(
    params?: FilaConferenciaFilter,
  ): Observable<FilaConferenciaDTO[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value as any);
        }
      });
    }

    return this.http.get<FilaConferenciaDTO[]>('/fila-conferencias', {
      params: httpParams,
    });
  }

  getStatus(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/fila-conferencias/status');
  }

  getTipoMovimento(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>(
      '/fila-conferencias/tipo-movimento',
    );
  }

  getTipoOperacao(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/fila-conferencias/tipo-operacao');
  }

  getTipoEntrega(): Observable<CodigoDescricao[]> {
    return this.http.get<CodigoDescricao[]>('/fila-conferencias/tipo-entrega');
  }
}
