import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ItemPedidoDTO,
  ItensConferidosResponse,
  PostDevolverItemConferidoParams,
  PostItemConferidoVolumeParams,
  PostRemoverVolumeParams,
} from './separacao.model';

@Injectable({
  providedIn: 'root',
})
export class SeparacaoService {
  constructor(private http: HttpClient) {}

  getItensPedido(numeroUnico: number): Observable<ItemPedidoDTO[]> {
    return this.http.get<ItemPedidoDTO[]>('/separacoes/itens-pedidos', {
      params: { numeroUnico },
    });
  }

  getItensConferidos(
    numeroConferencia: number,
  ): Observable<ItensConferidosResponse[]> {
    return this.http.get<ItensConferidosResponse[]>(
      '/separacoes/itens-conferidos',
      { params: { numeroConferencia } },
    );
  }

  postItemConferidoVolume(
    body: PostItemConferidoVolumeParams,
  ): Observable<null> {
    return this.http.post<null>('/separacoes/item-conferido-volume', body);
  }

  postRemoverVolume(body: PostRemoverVolumeParams): Observable<null> {
    return this.http.post<null>('/separacoes/remover-volume', body);
  }

  postDevolverItemConferido(
    body: PostDevolverItemConferidoParams,
  ): Observable<null> {
    return this.http.post<null>('/separacoes/devolver-item-conferido', body);
  }

  deletarVolumeLote(body: any): Observable<null> {
    return this.http.post<null>('/separacoes/deletar-volume-lote', body);
  }
}
