import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DadosGeraisPedidoDTO, ItemPedidoDTO } from './separacao.model';

@Injectable({
  providedIn: 'root',
})
export class SeparacaoService {
  private itensPedido: ItemPedidoDTO[] = [
    {
      imagem:
        'https://m.media-amazon.com/images/I/61pN8KO-z6L._AC_UF894,1000_QL80_.jpg',
      idProduto: 'PROD001',
      nomeProduto: 'Urna Funerária',
      codigoBarras: ['1234567890123', '1234567890999'],
      quantidade: '1',
      unidade: 'unidade',
      idMarca: 'MAR001',
      nomeMarca: 'Memorial Arte',
      idFornecedor: 'FORN001',
      nomeFornecedor: 'Marmoraria Eterna Ltda.',
      controle: 'Azul com flores brancas',
      complemento: 'Cerâmica',
    },
    {
      idProduto: 'PROD002',
      nomeProduto: 'Coroa de Flores Natural',
      codigoBarras: ['9876543210987'],
      quantidade: '12',
      unidade: 'unidades',
      idMarca: 'MAR002',
      nomeMarca: 'Flores do Além',
      idFornecedor: 'FORN002',
      nomeFornecedor: 'Floricultura Primavera S.A.',
      controle: 'Lírios',
      complemento: 'Coroa de Flores Naturais',
    },
    {
      imagem:
        'https://pt.ajcasketfactory.com/uploads/202238241/small/executive-cherry-wood-casket06364141050.jpg?size=380x0',
      idProduto: 'PROD003',
      nomeProduto: 'Caixão de Madeira Nobre',
      codigoBarras: ['1928374650912', '1928374650000'],
      quantidade: '2',
      unidade: 'unidades',
      idMarca: 'MAR003',
      nomeMarca: 'Madeiras Celestes',
      idFornecedor: 'FORN003',
      nomeFornecedor: 'Carpintaria Santo Antônio ME',
      controle: 'Carvalho Nobre',
      complemento:
        'Madeira de carvalho envelhecido cor vermelha, forro interno de cetim, alças douradas',
    },
  ];

  getItensPedido(): Observable<ItemPedidoDTO[]> {
    return of(this.itensPedido);
  }

  private dadosGeraisPedido: DadosGeraisPedidoDTO = {
    vendedor: {
      id: 'VEN001',
      nome: 'Carlos Almeida',
    },
    parceiro: {
      id: 'PAR001',
      nome: 'Maria da Silva',
    },
  };

  getDadosGerais(): Observable<DadosGeraisPedidoDTO> {
    return of(this.dadosGeraisPedido);
  }
}
