import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DadosGeraisPedidoDTO, ItemPedidoDTO } from './separacao.model';

@Injectable({
  providedIn: 'root',
})
export class SeparacaoService {
  private itensPedido: ItemPedidoDTO[] = [
    {
      produto: {
        id: 'FUN001',
        nome: 'Urna Funerária',
        imagem:
          'https://m.media-amazon.com/images/I/61pN8KO-z6L._AC_UF894,1000_QL80_.jpg',
        codigoBarras: '7891001001001',
        marca: {
          id: 'MAR-FUN01',
          nome: 'Memorial Arte',
        },
      },
      medidas: {
        quantidade: '1',
        unidade: 'unidade',
      },
      fornecedor: {
        id: 'FORN-FUN01',
        nome: 'Marmoraria Eterna Ltda.',
      },
      controle: 'Azul com flores brancas',
      complemento: 'Cerâmica',
    },
    {
      produto: {
        id: 'FUN002',
        nome: 'Coroa de Flores Natural',
        codigoBarras: '7892002002002',
        marca: {
          id: 'MAR-FUN02',
          nome: 'Flores do Além',
        },
      },
      medidas: {
        quantidade: '12',
        unidade: 'unidades',
      },
      fornecedor: {
        id: 'FORN-FUN02',
        nome: 'Floricultura Primavera S.A.',
      },
      controle: 'Lírios',
    },
    {
      produto: {
        id: 'FUN003',
        nome: 'Caixão de Madeira Nobre',
        imagem:
          'https://pt.ajcasketfactory.com/uploads/202238241/small/executive-cherry-wood-casket06364141050.jpg?size=380x0',
        codigoBarras: '7893003003003',
        marca: {
          id: 'MAR-FUN03',
          nome: 'Madeiras Celestes',
        },
      },
      medidas: {
        quantidade: '2',
        unidade: 'unidades',
      },
      fornecedor: {
        id: 'FORN-FUN03',
        nome: 'Carpintaria Santo Antônio ME',
      },
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

  getDadosgerais(): Observable<DadosGeraisPedidoDTO> {
    return of(this.dadosGeraisPedido);
  }
}
