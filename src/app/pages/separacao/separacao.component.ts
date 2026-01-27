import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
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
    private dialog: MatDialog,
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

  // template
  @ViewChild('modalItemNaoEncontrado')
  modalItemNaoEncontradoTpl!: TemplateRef<any>;

  @ViewChild('modalIniciarCubagemTpl')
  modalIniciarCubagemTpl!: TemplateRef<any>;

  ngOnInit(): void {
    this.numeroNota = this.route.snapshot.paramMap.get('numeroNota');

    this.form = this.fb.group({
      codigoBarras: [''],
      quantidade: [null],
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
      this.abrirModalItemNaoEncontrado();
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

    if (this.quantidadeCtrl?.value) {
      this.onBlurQuantidade();
    }
  }

  onBlurQuantidade() {
    const ctrl = this.quantidadeCtrl;
    if (!ctrl) return;

    if (ctrl.value === null || ctrl.value === '') {
      ctrl.setErrors(null);
      return;
    }

    const valor = Number(ctrl.value);

    if (valor <= 0) {
      ctrl.setErrors({ menorQueZero: true });
      return;
    }

    if (!this.itemSelecionado) {
      ctrl.setErrors(null);
      return;
    }

    const max = Number(this.itemSelecionado.medidas.quantidade);

    if (valor > max) {
      ctrl.setErrors({
        maiorQueDisponivel: {
          max,
        },
      });
      return;
    }

    ctrl.setErrors(null);
  }

  onConferir() {
    if (!this.itemSelecionado) return;

    const qtdCtrl = this.quantidadeCtrl;
    if (!qtdCtrl || qtdCtrl.value === null || qtdCtrl.value <= 0) {
      return;
    }

    if (qtdCtrl.invalid) return;

    const qtdInformada = Number(qtdCtrl.value);
    const qtdPedido = Number(this.itemSelecionado.medidas.quantidade);

    if (qtdInformada > qtdPedido) {
      return;
    }

    const restante = qtdPedido - qtdInformada;
    this.itemSelecionado.medidas.quantidade = String(restante);

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

    if (restante === 0) {
      this.dataSourcePedidos.data = this.dataSourcePedidos.data.filter(
        (i) => i !== this.itemSelecionado,
      );
    }

    this.dataSourcePedidos._updateChangeSubscription();
    this.dataSourceConferidos._updateChangeSubscription();

    this.limparFormulario();

    this.verificarSeFinalizouConferencia();
  }

  verificarSeFinalizouConferencia() {
    if (this.dataSourcePedidos.data.length === 0) {
      this.abrirModalIniciarCubagem();
    }
  }

  limparFormulario() {
    this.itemSelecionado = null;

    this.form.reset();

    Object.values(this.form.controls).forEach((ctrl) => {
      ctrl.setErrors(null);
      ctrl.markAsPristine();
      ctrl.markAsUntouched();
    });
  }

  abrirModalItemNaoEncontrado() {
    this.dialog.open(ModalComponent, {
      data: {
        template: this.modalItemNaoEncontradoTpl,
      },
    });
  }

  abrirModalIniciarCubagem() {
    this.dialog.open(ModalComponent, {
      data: {
        template: this.modalIniciarCubagemTpl,
      },
      disableClose: true,
    });
  }

  iniciarCubagem() {
    console.log('Iniciando cubagem...');
  }

  get quantidadeCtrl() {
    return this.form.get('quantidade');
  }
}
