import { Injectable } from '@angular/core';
import { api } from '../api';
import { CodigoDescricao } from '../dto/dominio.model';
import {
  FilaConferenciaDTO,
  FilaConferenciaFilter,
} from './fila-conferencia.model';

@Injectable({
  providedIn: 'root',
})
export class FilaConferenciaService {
  getFilaConferencias(params?: FilaConferenciaFilter) {
    return api.get<FilaConferenciaDTO[]>('/filas-conferencia', { params });
  }

  getStatus() {
    return api.get<CodigoDescricao[]>('/filas-conferencia/status');
  }

  getTipoMovimento() {
    return api.get<CodigoDescricao[]>('/filas-conferencia/tipo-movimento');
  }

  getTipoOperacao() {
    return api.get<CodigoDescricao[]>('/filas-conferencia/tipo-operacao');
  }

  getTipoEntrega() {
    return api.get<CodigoDescricao[]>('/filas-conferencia/tipo-entrega');
  }
}
