import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  FilaConferenciaDTO,
  ParceiroDTO,
  Status,
  TipoEntrega,
  TipoMovimento,
  TipoOperacao,
} from './fila-conferencia.model';

@Injectable({
  providedIn: 'root',
})
export class FilaConferenciaService {
  private filaConferencias: FilaConferenciaDTO[] = [
    {
      status: Status.AGUARDANDO_CONFERENCIA,
      idEmpresa: '123',
      numeroModial: 'MOD001',
      numeroNota: 'NF001',
      numeroUnico: 'UN001',
      dataMovimento: new Date(),
      tipoMovimento: TipoMovimento.COMPRA,
      tipoOperacao: TipoOperacao.CUBAGEM_PEDIDO,
      tipoEntrega: TipoEntrega.TRANSPORTADORA,
      nomeParceiro: 'John Doe',
      numeroParceiro: 'P001',
      numeroVendedor: 'V001',
      valorNota: '1000.00',
      volume: 'Caixa 10x20x5',
      idUsuarioInclusao: 'U001',
      idUsuarioAlteracao: 'U002',
    },
    {
      status: Status.EM_ANDAMENTO,
      idEmpresa: '456',
      numeroModial: 'MOD002',
      numeroNota: 'NF002',
      numeroUnico: 'UN002',
      dataMovimento: new Date(),
      tipoMovimento: TipoMovimento.PEDIDO_VENDA,
      tipoOperacao: TipoOperacao.NOTA_FISCAL_PRODUTO,
      tipoEntrega: TipoEntrega.TRANSPORTADORA,
      nomeParceiro: 'Jane Smith',
      numeroParceiro: 'P002',
      numeroVendedor: 'V002',
      valorNota: '500.50',
      volume: 'Caixa 15x15x10',
      idUsuarioInclusao: 'U003',
      idUsuarioAlteracao: 'U004',
    },
    {
      status: Status.FINALIZADA,
      idEmpresa: '456',
      numeroModial: 'MOD003',
      numeroNota: 'NF003',
      numeroUnico: 'UN003',
      dataMovimento: new Date(),
      tipoMovimento: TipoMovimento.PEDIDO_VENDA,
      tipoOperacao: TipoOperacao.NOTA_FISCAL_PRODUTO,
      tipoEntrega: TipoEntrega.TRANSPORTADORA,
      nomeParceiro: 'Roger Kyle',
      numeroParceiro: 'P003',
      numeroVendedor: 'V003',
      valorNota: '900.00',
      volume: 'Caixa 30x25x15',
      idUsuarioInclusao: 'U003',
      idUsuarioAlteracao: 'U004',
    },
  ];

  getFila(): Observable<FilaConferenciaDTO[]> {
    return of(this.filaConferencias);
  }

  private parceiros: ParceiroDTO[] = [
    { id: '1', nome: 'Empresa A', cpfCnpj: '12345678901' },
    { id: '2', nome: 'Empresa B', cpfCnpj: '98765432100' },
    { id: '3', nome: 'Empresa C', cpfCnpj: '11122233344' },
  ];

  getParceiros(): Observable<ParceiroDTO[]> {
    return of(this.parceiros);
  }
}
