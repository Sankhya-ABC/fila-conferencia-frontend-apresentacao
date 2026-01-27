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
        id: 'PROD001',
        nome: 'Arroz Integral',
        imagem:
          'https://destro.fbitsstatic.net/img/p/arroz-branco-tio-joao-tipo-1-5kg-70247/256783.jpg?w=500&h=500&v=202501231555&qs=ignore',
        codigoBarras: '7891234567890',
        marca: {
          id: 'MAR01',
          nome: 'Tio João',
        },
      },
      medidas: {
        quantidade: '5',
        unidade: 'kg',
      },
      fornecedor: {
        id: 'FORN001',
        nome: 'Distribuidora Alimentos Ltda',
      },
      controle: 'LOTE2024A001',
      complemento: 'Grãos selecionados, embalagem a vácuo',
    },
    {
      produto: {
        id: 'PROD002',
        nome: 'Feijão Carioca',
        codigoBarras: '7899876543210',
        marca: {
          id: 'MAR02',
          nome: 'Camil',
        },
      },
      medidas: {
        quantidade: '1',
        unidade: 'kg',
      },
      fornecedor: {
        id: 'FORN002',
        nome: 'Cereais do Brasil S.A.',
      },
      controle: 'LOTE2024B045',
      complemento: 'Produto tipo 1, lavado e selecionado',
    },
    {
      produto: {
        id: 'PROD003',
        nome: 'Óleo de Soja',
        codigoBarras: '7895551234567',
        marca: {
          id: 'MAR03',
          nome: 'Liza',
        },
      },
      medidas: {
        quantidade: '900',
        unidade: 'ml',
      },
      fornecedor: {
        id: 'FORN003',
        nome: 'Óleos Vegetais Ind. e Com.',
      },
      controle: 'LOTE2024C123',
      complemento: 'Óleo refinado, garrafa plástica PET',
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
