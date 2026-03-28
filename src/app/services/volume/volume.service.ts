import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PostAtualizarDimensoesVolumeDetalhadoParams,
  PostAtualizarDimensoesVolumeNaoDetalhadoLoteParams,
  VolumeDTO,
} from './volume.model';

@Injectable({
  providedIn: 'root',
})
export class VolumeService {
  constructor(private http: HttpClient) {}

  getVolumes(numeroConferencia: number): Observable<VolumeDTO[]> {
    return this.http.get<VolumeDTO[]>('/volumes', {
      params: { numeroConferencia },
    });
  }

  gerarVolumesLote(body: any): Observable<null> {
    return this.http.post<null>('/volumes/gerar-volumes-lote', body);
  }

  postAtualizarDimensoesVolumeDetalhado(
    body: PostAtualizarDimensoesVolumeDetalhadoParams,
  ): Observable<null> {
    return this.http.post<null>('/volumes/dimensoes-volume', body);
  }

  postAtualizarDimensoesVolumeNaoDetalhadoLote(
    body: PostAtualizarDimensoesVolumeNaoDetalhadoLoteParams,
  ): Observable<null> {
    return this.http.post<null>('/volumes/dimensoes-volume-lote', body);
  }
}
