import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParceiroDTO, ParceiroFilter } from './parceiro.model';

@Injectable({
  providedIn: 'root',
})
export class ParceiroService {
  constructor(private http: HttpClient) {}

  getParceiros(params: ParceiroFilter): Observable<ParceiroDTO[]> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<ParceiroDTO[]>('/parceiros', { params: httpParams });
  }
}
