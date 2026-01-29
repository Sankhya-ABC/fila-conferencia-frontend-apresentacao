import { Injectable } from '@angular/core';
import { api } from '../api';
import { ParceiroDTO, ParceiroFilter } from './parceiro.model';

@Injectable({
  providedIn: 'root',
})
export class ParceiroService {
  getParceiros(params: ParceiroFilter) {
    return api.get<ParceiroDTO[]>('/parceiros', { params });
  }
}
