import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PostAtualizarDimensoesVolumeDetalhadoParams,
  PostAtualizarDimensoesVolumeNaoDetalhadoLoteParams,
  PostAtualizarDimensoesVolumeParams,
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

  postAtualizarDimensoesVolume(
    body: PostAtualizarDimensoesVolumeParams,
  ): Observable<null> {
    return this.http.post<null>('/volumes/dimensoes-volume', body);
  }
}
