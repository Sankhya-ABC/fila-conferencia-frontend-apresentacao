import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArquivoService {
  constructor(private http: HttpClient) {}

  downloadEtiqueta(numeroConferencia: number) {
    return this.http.get(`/arquivos/etiqueta/download`, {
      params: { numeroConferencia },
      responseType: 'blob',
    });
  }
}
