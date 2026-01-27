import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ItemPedidoDTO } from './separacao.model';

@Injectable({
  providedIn: 'root',
})
export class SeparacaoService {
  private itensPedido: ItemPedidoDTO[] = [
    {
      produto: {
        imagem: 'https://exemplo.com/imagens/arroz.jpg',
        codigoBarras: '7891234567890',
        id: 'PROD001',
        nome: 'Arroz Integral',
        marca: 'Tio João',
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
        imagem: 'https://exemplo.com/imagens/feijao.jpg',
        codigoBarras: '7899876543210',
        id: 'PROD002',
        nome: 'Feijão Carioca',
        marca: 'Camil',
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
        imagem: 'https://exemplo.com/imagens/oleo.jpg',
        codigoBarras: '7895551234567',
        id: 'PROD003',
        nome: 'Óleo de Soja',
        marca: 'Liza',
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
}
