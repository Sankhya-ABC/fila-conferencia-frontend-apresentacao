import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DadosBasicosPedidoDTO,
  ItemPedidoDTO,
  ItensConferidosResponse,
  PostAtualizarDimensoesVolumeParams,
  PostDevolverItemConferidoParams,
  PostFinalizarConferenciaParams,
  PostItemConferidoVolumeParams,
  PostRemoverVolumeParams,
  VolumeDTO,
} from './separacao.model';

@Injectable({
  providedIn: 'root',
})
export class SeparacaoService {
  constructor(private http: HttpClient) {}

  getDadosBasicos(numeroUnico: number): Observable<DadosBasicosPedidoDTO> {
    return this.http.get<DadosBasicosPedidoDTO>('/separacoes/dados-basicos', {
      params: { numeroUnico },
    });
  }

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

  getVolumes(numeroConferencia: number): Observable<VolumeDTO[]> {
    return this.http.get<VolumeDTO[]>('/separacoes/volumes', {
      params: { numeroConferencia },
    });
  }

  downloadEtiqueta(numeroConferencia: number) {
    return this.http.get(`/separacoes/etiqueta/download`, {
      params: { numeroConferencia },
      responseType: 'blob',
    });
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

  postAtualizarDimensoesVolume(
    body: PostAtualizarDimensoesVolumeParams,
  ): Observable<null> {
    return this.http.post<null>('/separacoes/dimensoes-volume', body);
  }

  postFinalizarConferencia(
    body: PostFinalizarConferenciaParams,
  ): Observable<null> {
    return this.http.post<null>('/separacoes/finalizar-conferencia', body);
  }

  gerarVolumesLote(body: any): Observable<null> {
    return this.http.post<null>('/separacoes/gerar-volumes-lote', body);
  }

  deletarVolumeLote(body: any): Observable<null> {
    return this.http.post<null>('/separacoes/deletar-volume-lote', body);
  }

  salvarDimensoesVolumeLote(body: any): Observable<null> {
    return this.http.post<null>('/separacoes/dimensoes-volume-lote', body);
  }
}
