import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodigoDescricao } from '../dominio/dominio.model';
import {
  FilaConferenciaDTO,
  FilaConferenciaFilter,
  PostIniciarConferenciaParams,
  PostIniciarConferenciaResponse,
} from './conferencia.model';

@Injectable({
  providedIn: 'root',
})
export class ConferenciaService {
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

    return this.http.get<FilaConferenciaDTO[]>('/conferencias', {
      params: httpParams,
    });
  }

  postIniciarConferencia(
    body: PostIniciarConferenciaParams,
  ): Observable<PostIniciarConferenciaResponse> {
    return this.http.post<PostIniciarConferenciaResponse>(
      '/conferencias/iniciar-conferencia',
      body,
    );
  }
}
