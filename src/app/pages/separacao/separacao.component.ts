import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
    ReactiveFormsModule,
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
  constructor(
    private fb: FormBuilder,
    private separacaoService: SeparacaoService,
    private route: ActivatedRoute,
  ) {}

  // data
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

  dadosGerais!: DadosGeraisPedidoDTO;
  numeroNota: string | null = null;

  // form
  form!: FormGroup;

  // control
  itemSelecionado: ItemPedidoDTO | null = null;

  ngOnInit(): void {
    this.numeroNota = this.route.snapshot.paramMap.get('numeroNota');

    this.form = this.fb.group({
      codigoBarras: [''],
      quantidade: [null, [Validators.required, Validators.min(1)]],
      controle: [{ value: '', disabled: true }],
    });

    this.separacaoService.getItensPedido().subscribe((dados) => {
      this.dataSourcePedidos.data = dados;
    });

    this.separacaoService.getDadosgerais().subscribe((data) => {
      this.dadosGerais = data;
    });
  }

  // acoes
  onIniciarConferencia(item: ItemPedidoDTO) {
    this.selecionarItem(item);
  }

  onCodigoInserido() {
    const codigo = this.form.get('codigoBarras')?.value;
    if (!codigo) return;

    const item = this.dataSourcePedidos.data.find(
      (i) => i.produto.codigoBarras === codigo,
    );

    if (!item) {
      alert('Item não encontrado no pedido');
      this.limparFormulario();
      return;
    }

    this.selecionarItem(item);
  }

  selecionarItem(item: ItemPedidoDTO) {
    this.itemSelecionado = item;

    this.form.patchValue({
      codigoBarras: item.produto.codigoBarras,
      controle: item.controle ?? '',
    });
  }

  onConferir() {
    if (!this.itemSelecionado || this.form.invalid) return;

    const qtdInformada = Number(this.form.get('quantidade')?.value);
    const qtdPedido = Number(this.itemSelecionado.medidas.quantidade);

    if (qtdInformada > qtdPedido) {
      return; // regra mantida, sem alert
    }

    // diminui do pedido
    const restante = qtdPedido - qtdInformada;
    this.itemSelecionado.medidas.quantidade = String(restante);

    // adiciona / soma nos conferidos
    const existente = this.dataSourceConferidos.data.find(
      (i) =>
        i.produto.codigoBarras === this.itemSelecionado!.produto.codigoBarras,
    );

    if (existente) {
      existente.medidas.quantidade = String(
        Number(existente.medidas.quantidade) + qtdInformada,
      );
    } else {
      this.dataSourceConferidos.data.push({
        ...this.itemSelecionado,
        medidas: {
          ...this.itemSelecionado.medidas,
          quantidade: String(qtdInformada),
        },
      });
    }

    // remove do pedido se zerar
    if (restante === 0) {
      this.dataSourcePedidos.data = this.dataSourcePedidos.data.filter(
        (i) => i !== this.itemSelecionado,
      );
    }

    this.dataSourcePedidos._updateChangeSubscription();
    this.dataSourceConferidos._updateChangeSubscription();

    this.limparFormulario();
  }

  limparFormulario() {
    this.itemSelecionado = null;
    this.form.reset();
  }

  // helper para template
  get quantidadeCtrl() {
    return this.form.get('quantidade');
  }
}
