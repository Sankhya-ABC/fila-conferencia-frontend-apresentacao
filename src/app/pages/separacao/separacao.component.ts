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
import { AuthService } from '../../services/auth/auth.service';
import {
  DadosBasicosPedidoDTO,
  ItemPedidoDTO,
  VolumeDTO,
} from '../../services/separacao/separacao.model';
import { SeparacaoService } from '../../services/separacao/separacao.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

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
    MatOption,
    MatSelect,
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
    private authService: AuthService,
  ) {}

  // data
  displayedColumnsPedidos = [
    'acoes',
    'imagem',
    'idProduto',
    'nomeProduto',
    'codigoBarras',
    'quantidade',
    'unidade',
    'idMarca',
    'nomeMarca',
    'idFornecedor',
    'nomeFornecedor',
    'controle',
    'complemento',
  ];
  dataSourcePedidos = new MatTableDataSource<ItemPedidoDTO>([]);

  displayedColumnsConferidos = [
    'acoes',
    'imagem',
    'idProduto',
    'nomeProduto',
    'codigoBarras',
    'quantidade',
    'unidade',
    'idMarca',
    'nomeMarca',
    'idFornecedor',
    'nomeFornecedor',
    'controle',
    'complemento',
  ];
  dataSourceConferidos = new MatTableDataSource<ItemPedidoDTO>([]);

  dadosGerais!: DadosBasicosPedidoDTO;
  numeroUnico: number | null = null;
  idUsuario = this.authService.getUser().idUsuario;
  volumes: VolumeDTO[] = [];

  // form
  form!: FormGroup;

  // control
  itemSelecionado: ItemPedidoDTO | null = null;
  controlesDisponiveis: string[] = [];
  produtoIdentificado = false;

  // template
  @ViewChild('modalItemNaoEncontrado')
  modalItemNaoEncontradoTpl!: TemplateRef<any>;

  @ViewChild('modalIniciarCubagemTpl')
  modalIniciarCubagemTpl!: TemplateRef<any>;

  ngOnInit(): void {
    this.numeroUnico = Number(this.route.snapshot.paramMap.get('numeroUnico'));

    this.form = this.fb.group({
      identificador: [''],
      quantidade: [null],
      controle: [''],
    });

    // obter dados básicos
    this.separacaoService.getDadosBasicos(this.numeroUnico).subscribe({
      next: (respDadosGerais) => {
        this.dadosGerais = respDadosGerais;

        // iniciar conferência
        if (respDadosGerais.codigoStatus === 'AC') {
          this.separacaoService
            .postIniciarConferencia({
              idUsuario: this.idUsuario,
              numeroUnico: respDadosGerais.numeroUnico,
            })
            .subscribe({
              error: (err) => {
                console.error(err);
              },
            });
        }

        // obter itens pedidos
        if (respDadosGerais.numeroUnico) {
          this.separacaoService
            .getItensPedido(respDadosGerais.numeroUnico!)
            .subscribe({
              next: (respItensPedido) => {
                // obter itens conferidos
                if (respDadosGerais.numeroConferencia) {
                  this.separacaoService
                    .getItensConferidos(respDadosGerais.numeroConferencia)
                    .subscribe({
                      // separar itens já conferidos dos itens do pedido
                      next: (respItensConferidos) => {
                        const mapConferidos = new Map(
                          respItensConferidos.map((i) => [
                            i.idProduto,
                            i.quantidade,
                          ]),
                        );

                        const pedidos: ItemPedidoDTO[] = [];
                        const conferidos: ItemPedidoDTO[] = [];

                        respItensPedido.forEach((item) => {
                          const qtdConferida = mapConferidos.get(
                            item.idProduto,
                          );

                          if (qtdConferida) {
                            conferidos.push({
                              ...item,
                              quantidade: qtdConferida,
                            });

                            const restante = item.quantidade - qtdConferida;

                            if (restante > 0) {
                              pedidos.push({
                                ...item,
                                quantidade: restante,
                              });
                            }
                          } else {
                            pedidos.push(item);
                          }
                        });

                        this.dataSourcePedidos.data = pedidos;
                        this.dataSourceConferidos.data = conferidos;
                      },
                      error: (err) => {
                        console.error(err);
                      },
                    });
                } else {
                  this.dataSourcePedidos.data = respItensPedido;
                  this.dataSourceConferidos.data = [];
                }
              },
              error: (err) => {
                console.error(err);
              },
            });
        }

        // obter volumes
        if (
          respDadosGerais.numeroConferencia &&
          respDadosGerais.codigoTipoMovimento === 'P'
        ) {
          this.separacaoService
            .getVolumes(respDadosGerais.numeroConferencia)
            .subscribe({
              next: (resp) => (this.volumes = resp),
              error: (err) => console.error(err),
            });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // helper
  mesmaChaveItem(
    a: { idProduto: number; controle?: string },
    b: { idProduto: number; controle?: string },
  ) {
    return (
      a.idProduto === b.idProduto && (a.controle ?? '') === (b.controle ?? '')
    );
  }

  // acoes
  onIniciarConferencia(item: ItemPedidoDTO) {
    this.selecionarItem(item);
  }

  onIdentificadorInserido() {
    const identificadorRaw = this.form.get('identificador')?.value;
    if (!identificadorRaw) return;

    const identificador = identificadorRaw.toString().trim();
    const identificadorNumero = Number(identificador);

    const itensDoProduto = this.dataSourcePedidos.data.filter(
      (i) =>
        i.idProduto === identificadorNumero ||
        i.codigoBarras?.some((cb) => cb.toString() === identificador),
    );

    if (itensDoProduto.length === 0) {
      this.abrirModalItemNaoEncontrado();
      this.limparFormulario();
      return;
    }

    this.controlesDisponiveis = Array.from(
      new Set(itensDoProduto.map((i) => i.controle ?? '')),
    );

    const controleInicial = this.controlesDisponiveis[0];

    this.form.patchValue({
      controle: controleInicial,
    });

    const item = itensDoProduto.find(
      (i) => (i.controle ?? '') === controleInicial,
    )!;

    this.selecionarItem(item);

    this.produtoIdentificado = true;
  }

  onControleChange(controle: string) {
    if (!this.itemSelecionado) return;

    const item = this.dataSourcePedidos.data.find(
      (i) =>
        i.idProduto === this.itemSelecionado!.idProduto &&
        (i.controle ?? '') === controle,
    );

    if (!item) return;

    this.selecionarItem(item);
  }

  selecionarItem(item: ItemPedidoDTO) {
    this.itemSelecionado = item;

    this.form.patchValue({
      identificador: item.idProduto,
      controle: item.controle ?? '',
    });

    if (this.quantidadeCtrl?.value) {
      this.onBlurQuantidade();
    }
  }

  onDevolverItemConferido(item: ItemPedidoDTO) {
    this.dataSourceConferidos.data = this.dataSourceConferidos.data.filter(
      (i) => i !== item,
    );

    const existentePedido = this.dataSourcePedidos.data.find((i) =>
      this.mesmaChaveItem(i, item),
    );

    if (existentePedido) {
      existentePedido.quantidade += item.quantidade;
    } else {
      this.dataSourcePedidos.data.push({ ...item });
    }

    this.dataSourcePedidos._updateChangeSubscription();
    this.dataSourceConferidos._updateChangeSubscription();

    this.removerItemDosVolumes(item);
  }

  removerItemDosVolumes(item: ItemPedidoDTO) {
    //
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

    const max = Number(this.itemSelecionado.quantidade);

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
    const qtdPedido = Number(this.itemSelecionado.quantidade);

    if (qtdInformada > qtdPedido) {
      return;
    }

    const restante = qtdPedido - qtdInformada;
    this.itemSelecionado.quantidade = restante;

    const existente = this.dataSourceConferidos.data.find((i) =>
      this.mesmaChaveItem(i, this.itemSelecionado!),
    );

    if (existente) {
      existente.quantidade = existente.quantidade + qtdInformada;
    } else {
      this.dataSourceConferidos.data.push({
        ...this.itemSelecionado,
        quantidade: qtdInformada,
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
    this.controlesDisponiveis = [];
    this.produtoIdentificado = false;

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
