import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  DadosGeraisPedidoDTO,
  ItemPedidoDTO,
} from '../../services/separacao/separacao.model';
import { SeparacaoService } from '../../services/separacao/separacao.service';

@Component({
  selector: 'app-separacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './separacao.component.html',
  styleUrl: './separacao.component.scss',
})
export class SeparacaoComponent implements OnInit {
  displayedColumnsPedidos = [
    'acoes',
    'imagem',
    'produto.codigoBarras',
    'produto.nome',
    'medidas.quantidade',
    'medidas.unidade',
    'produto.marca.id',
    'produto.marca.nome',
    'fornecedor.id',
    'fornecedor.nome',
    'controle',
    'complemento',
  ];

  displayedColumnsConferidos = [
    'imagem',
    'produto.codigoBarras',
    'produto.nome',
    'medidas.quantidade',
    'medidas.unidade',
    'produto.marca.id',
    'produto.marca.nome',
    'fornecedor.id',
    'fornecedor.nome',
    'controle',
    'complemento',
  ];

  dataSourcePedidos = new MatTableDataSource<ItemPedidoDTO>([]);
  dataSourceConferidos = new MatTableDataSource<ItemPedidoDTO>([]);

  codigoBarras = '';
  quantidade = 1;

  itemSelecionado: ItemPedidoDTO | null = null;

  dadosGerais!: DadosGeraisPedidoDTO;
  numeroNota: string | null = null;

  constructor(
    private separacaoService: SeparacaoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.numeroNota = this.route.snapshot.paramMap.get('numeroNota');

    this.separacaoService.getItensPedido().subscribe((dados) => {
      this.dataSourcePedidos.data = [...dados];
    });

    this.separacaoService.getDadosgerais().subscribe((data) => {
      this.dadosGerais = data;
    });
  }

  onIniciarConferencia(item: ItemPedidoDTO) {
    this.selecionarItem(item);
  }

  onCodigoInserido() {
    if (!this.codigoBarras) return;

    const item = this.dataSourcePedidos.data.find(
      (i) => i.produto.codigoBarras === this.codigoBarras,
    );

    if (!item) {
      alert('Item não encontrado no pedido');
      this.codigoBarras = '';
      return;
    }

    this.selecionarItem(item);
  }

  selecionarItem(item: ItemPedidoDTO) {
    this.itemSelecionado = item;
    this.codigoBarras = item.produto.codigoBarras;
  }

  onConferir() {
    if (!this.itemSelecionado) return;

    const qtdPedido = Number(this.itemSelecionado.medidas.quantidade);

    if (this.quantidade > qtdPedido) {
      alert('Quantidade maior que a disponível');
      return;
    }

    // diminui do pedido
    this.itemSelecionado.medidas.quantidade = String(
      qtdPedido - this.quantidade,
    );

    // adiciona / soma nos conferidos
    const existente = this.dataSourceConferidos.data.find(
      (i) =>
        i.produto.codigoBarras === this.itemSelecionado!.produto.codigoBarras,
    );

    if (existente) {
      existente.medidas.quantidade = String(
        Number(existente.medidas.quantidade) + this.quantidade,
      );
    } else {
      this.dataSourceConferidos.data.push({
        ...this.itemSelecionado,
        medidas: {
          ...this.itemSelecionado.medidas,
          quantidade: String(this.quantidade),
        },
      });
    }

    // remove do pedido se zerar
    if (Number(this.itemSelecionado.medidas.quantidade) === 0) {
      this.dataSourcePedidos.data = this.dataSourcePedidos.data.filter(
        (i) => i !== this.itemSelecionado,
      );
    }

    this.dataSourcePedidos._updateChangeSubscription();
    this.dataSourceConferidos._updateChangeSubscription();

    this.codigoBarras = '';
    this.quantidade = 1;
    this.itemSelecionado = null;
  }
}
