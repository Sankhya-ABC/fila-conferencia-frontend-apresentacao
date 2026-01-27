import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    MatButtonModule,
    MatCard,
  ],
  templateUrl: './separacao.component.html',
  styleUrl: './separacao.component.scss',
})
export class SeparacaoComponent implements OnInit {
  constructor(
    private separacaoService: SeparacaoService,
    private route: ActivatedRoute,
  ) {}

  displayedColumns: string[] = [
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
  dataSource = new MatTableDataSource<ItemPedidoDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dadosGerais!: DadosGeraisPedidoDTO;
  numeroNota: string | null = null;

  codigoBarras = '';
  quantidade = 1;

  itemSelecionado: ItemPedidoDTO | null = null;

  itensConferidos: ItemPedidoDTO[] = [];

  ngOnInit(): void {
    this.numeroNota = this.route.snapshot.paramMap.get('numeroNota');

    this.separacaoService.getItensPedido().subscribe((dados) => {
      this.dataSource.data = dados;
      this.dataSource.paginator = this.paginator;
    });

    this.separacaoService.getDadosgerais().subscribe((data) => {
      this.dadosGerais = data;
    });

    console.log(this.dataSource.filteredData?.[0]?.produto?.imagem);
  }

  // ações
  onCodigoInserido() {
    const item = this.dataSource.data.find(
      (i) => i.produto.codigoBarras === this.codigoBarras,
    );

    if (!item) {
      this.abrirModalItemNaoEncontrado();
      // TODO: limpar formulário
      return;
    }

    this.selecionarItem(item);
  }

  onBlurCodigo() {
    if (this.codigoBarras) {
      this.onCodigoInserido();
    }
  }

  selecionarItem(item: ItemPedidoDTO) {
    this.itemSelecionado = item;
    this.codigoBarras = item.produto.codigoBarras;
  }

  onConferir() {
    if (!this.itemSelecionado) return;

    const quantidadePedido = Number(this.itemSelecionado.medidas.quantidade);

    if (this.quantidade > quantidadePedido) {
      alert('Quantidade maior do que a disponível no pedido');
      return;
    }

    // remove do pedido
    this.itemSelecionado.medidas.quantidade = String(
      quantidadePedido - this.quantidade,
    );

    // adiciona aos conferidos
    this.itensConferidos.push({
      ...this.itemSelecionado,
      medidas: {
        ...this.itemSelecionado.medidas,
        quantidade: String(this.quantidade),
      },
    });

    // reset
    this.codigoBarras = '';
    this.quantidade = 1;
    this.itemSelecionado = null;

    this.dataSource._updateChangeSubscription();
  }

  abrirModalItemNaoEncontrado() {
    alert('Item não encontrado na lista do pedido');
  }
}
