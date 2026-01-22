import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  FilaConferenciaDTO,
  Status,
  TipoMovimento,
  TipoOperacao,
  TipoEntrega,
} from './fila-conferencia.model';

@Injectable({
  providedIn: 'root',
})
export class FilaConferenciaService {
  private dados: FilaConferenciaDTO[] = [
    {
      status: Status.AGUARDANDO_CONFERENCIA,
      idEmpresa: '123',
      numeroModial: 'MOD123',
      numeroNota: 'NF001',
      numeroUnico: 'UN001',
      dataMovimento: new Date(),
      tipoMovimento: TipoMovimento.COMPRA,
      tipoOperacao: TipoOperacao.CUBAGEM_PEDIDO,
      tipoEntrega: TipoEntrega.TRANSPORTADORA,
      nomeParceiro: 'John Doe',
      numeroParceiro: 'P001',
      numeroVendedor: 'V001',
      valorNota: '1000',
      volume: 'Caixa - 10x20x5',
      idUsuarioInclusao: 'U001',
      idUsuarioAlteracao: 'U002',
    },
  ];

  getFila(): Observable<FilaConferenciaDTO[]> {
    return of(this.dados);
  }
}
