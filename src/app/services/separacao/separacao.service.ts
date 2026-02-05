import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosBasicosPedidoDTO, ItemPedidoDTO } from './separacao.model';

@Injectable({
  providedIn: 'root',
})
export class SeparacaoService {
  constructor(private http: HttpClient) {}

  getDadosBasicos(numeroUnico: string): Observable<DadosBasicosPedidoDTO> {
    return this.http.get<DadosBasicosPedidoDTO>('/separacoes/dados-basicos', {
      params: { numeroUnico },
    });
  }

  getItensPedido(numeroUnico: string): Observable<ItemPedidoDTO[]> {
    return this.http.get<ItemPedidoDTO[]>('/separacoes/itens-pedidos', {
      params: { numeroUnico },
    });
  }
}
