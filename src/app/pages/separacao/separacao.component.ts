import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {
  DadosBasicosPedidoDTO,
  ItemPedidoDTO,
  VolumeFrontDTO,
} from '../../services/separacao/separacao.model';
import { SeparacaoService } from '../../services/separacao/separacao.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-separacao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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

  // volume
  volumes: VolumeFrontDTO[] = [];
  volumeAtivo!: VolumeFrontDTO;

  // form
  form!: FormGroup;

  // control
  itemSelecionado: ItemPedidoDTO | null = null;
  controlesDisponiveis: string[] = [];
  produtoIdentificado = false;

  // template
  @ViewChild('modalItemNaoEncontrado')
  modalItemNaoEncontradoTpl!: TemplateRef<any>;

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
                        const chave = (i: {
                          idProduto: number;
                          controle?: string;
                        }) => `${i.idProduto}#${i.controle ?? ''}`;

                        const mapConferidos = new Map(
                          respItensConferidos.map((i) => [
                            chave(i),
                            i.quantidade,
                          ]),
                        );

                        const pedidos: ItemPedidoDTO[] = [];
                        const conferidos: ItemPedidoDTO[] = [];

                        respItensPedido.forEach((item) => {
                          const qtdConferida = mapConferidos.get(chave(item));

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
              next: (resp) => {
                this.volumes = resp.map((v) => ({
                  ...v,
                  ativo: false,
                }));

                this.garantirVolumeAtivo();
              },
              error: (err) => console.error(err),
            });
        }

        // criar volume
        if (
          respDadosGerais.codigoTipoMovimento === 'P' &&
          this.volumes.length === 0
        ) {
          this.criarNovoVolume();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // helper
  chaveItem(i: { idProduto: number; controle?: string }) {
    return `${i.idProduto}#${i.controle ?? ''}`;
  }

  mesmaChaveItem(
    a: { idProduto: number; controle?: string },
    b: { idProduto: number; controle?: string },
  ) {
    return this.chaveItem(a) === this.chaveItem(b);
  }

  normalizarControle(controle?: string | null): string {
    return controle?.trim() || '';
  }

  existeVolumeVazio(): boolean {
    return this.volumes.some((v) => v.itens.length === 0);
  }

  proximoNumeroVolume(): number {
    if (!this.volumes.length) {
      return 1;
    }

    return Math.max(...this.volumes.map((v) => v.numeroVolume)) + 1;
  }

  removerVolumesVazios() {
    this.volumes = this.volumes.filter((v) => v.itens.length > 0);
  }

  get aindaHaItensParaConferir(): boolean {
    return this.dataSourcePedidos.data.length > 0;
  }

  get quantidadeCtrl() {
    return this.form.get('quantidade');
  }

  get conferenciaFinalizada(): boolean {
    return this.dataSourcePedidos.data.length === 0;
  }

  get todosItensNosVolumes(): boolean {
    if (!this.conferenciaFinalizada) return false;

    const chave = (i: { idProduto: number; controle?: string }) =>
      `${i.idProduto}#${i.controle ?? ''}`;

    const itensVolumes = new Map<string, number>();

    this.volumes.forEach((v) => {
      v.itens.forEach((i) => {
        const k = chave(i);
        itensVolumes.set(k, (itensVolumes.get(k) || 0) + i.quantidade);
      });
    });

    return this.dataSourceConferidos.data.every((i) => {
      return itensVolumes.get(chave(i)) === i.quantidade;
    });
  }

  get todosVolumesComDimensoes(): boolean {
    return (
      this.volumes.length > 0 &&
      this.volumes.every(
        (v) => !!v.largura && !!v.comprimento && !!v.altura && !!v.peso,
      )
    );
  }

  get podeConfirmarConferencia(): boolean {
    if (!this.conferenciaFinalizada) return false;

    if (this.dadosGerais.codigoTipoMovimento === 'P') {
      return this.todosItensNosVolumes && this.todosVolumesComDimensoes;
    }

    return true;
  }

  get deveMostrarBotaoConfirmar(): boolean {
    if (!this.conferenciaFinalizada) return false;

    if (this.dadosGerais.codigoTipoMovimento === 'P') {
      return this.todosItensNosVolumes;
    }

    return true;
  }

  // acoes
  confirmarConferencia() {
    console.log('Conferência confirmada', {
      volumes: this.volumes,
      conferidos: this.dataSourceConferidos.data,
    });
  }

  onIniciarConferencia(item: ItemPedidoDTO) {
    const itensDoProduto = this.dataSourcePedidos.data.filter(
      (i) => i.idProduto === item.idProduto,
    );

    this.prepararSelecaoItem(itensDoProduto, item.controle ?? '');
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

    this.prepararSelecaoItem(itensDoProduto);
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
      controle: this.normalizarControle(item.controle),
    });

    this.produtoIdentificado = true;

    if (this.quantidadeCtrl?.value) {
      this.onBlurQuantidade();
    }
  }

  private prepararSelecaoItem(
    itensDoProduto: ItemPedidoDTO[],
    controlePreferido?: string,
  ) {
    this.controlesDisponiveis = Array.from(
      new Set(itensDoProduto.map((i) => i.controle?.trim() || 'SEM_CONTROLE')),
    );

    let controleSelecionado: string;

    if (
      this.controlesDisponiveis.length === 1 &&
      this.controlesDisponiveis[0] === 'SEM_CONTROLE'
    ) {
      controleSelecionado = '';
    } else {
      controleSelecionado =
        controlePreferido ??
        (this.controlesDisponiveis[0] === 'SEM_CONTROLE'
          ? ''
          : this.controlesDisponiveis[0]);
    }

    this.form.patchValue({
      controle: controleSelecionado,
    });

    const item = itensDoProduto.find(
      (i) =>
        this.normalizarControle(i.controle) ===
        this.normalizarControle(controleSelecionado),
    );

    if (!item) return;

    this.selecionarItem(item);
    this.produtoIdentificado = true;
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

    this.reativarUltimoVolumeSeNecessario();
  }

  reativarUltimoVolumeSeNecessario() {
    if (!this.aindaHaItensParaConferir) return;

    if (!this.volumes.length) return;

    this.volumes.forEach((v) => (v.ativo = false));

    const ultimo = [...this.volumes].sort(
      (a, b) => b.numeroVolume - a.numeroVolume,
    )[0];

    ultimo.ativo = true;
    this.volumeAtivo = ultimo;

    this.volumes = this.volumes.filter((v) => v !== ultimo);
    this.volumes.unshift(ultimo);
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

  garantirVolumeAtivo() {
    if (!this.volumes.length) {
      this.criarNovoVolume();
      return;
    }

    const ativo = this.volumes.find((v) => v.ativo);
    if (!ativo) {
      this.volumes[0].ativo = true;
      this.volumeAtivo = this.volumes[0];
    } else {
      this.volumeAtivo = ativo;
    }
  }

  adicionarItemAoVolume(item: ItemPedidoDTO, quantidade: number) {
    this.garantirVolumeAtivo();

    const existente = this.volumeAtivo.itens.find((i) =>
      this.mesmaChaveItem(i, item),
    );

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      this.volumeAtivo.itens.push({
        idProduto: item.idProduto,
        descricaoProduto: item.nomeProduto,
        imagem: item.imagem || null,
        quantidade,
        unidade: item.unidade,
        controle: item.controle ?? '',
      });
    }
  }

  encerrarVolume(volume: VolumeFrontDTO) {
    if (!volume.itens.length || this.conferenciaFinalizada) return;

    volume.ativo = false;
    this.volumeAtivo = undefined as any;

    if (this.aindaHaItensParaConferir && !this.existeVolumeVazio()) {
      this.criarNovoVolume();
    }

    this.volumes = [...this.volumes].sort(
      (a, b) => b.numeroVolume - a.numeroVolume,
    );

    this.garantirVolumeAtivo();
  }

  selecionarVolume(volume: VolumeFrontDTO) {
    if (this.conferenciaFinalizada) return;

    this.volumes.forEach((v) => (v.ativo = false));

    volume.ativo = true;
    this.volumeAtivo = volume;

    this.volumes = this.volumes.filter((v) => v !== volume);

    this.volumes.unshift(volume);
  }

  removerItemDosVolumes(item: ItemPedidoDTO) {
    for (const volume of this.volumes) {
      volume.itens = volume.itens.filter((i) => !this.mesmaChaveItem(i, item));
    }
  }

  devolverItensDoVolume(volume: VolumeFrontDTO) {
    volume.itens.forEach((itemVolume) => {
      const conferidos = this.dataSourceConferidos.data;
      const idxConferido = conferidos.findIndex(
        (i) =>
          i.idProduto === itemVolume.idProduto &&
          (i.controle ?? '') === (itemVolume.controle ?? ''),
      );

      if (idxConferido !== -1) {
        conferidos[idxConferido].quantidade -= itemVolume.quantidade;

        if (conferidos[idxConferido].quantidade <= 0) {
          conferidos.splice(idxConferido, 1);
        }
      }

      const pedidos = this.dataSourcePedidos.data;
      const existentePedido = pedidos.find(
        (i) =>
          i.idProduto === itemVolume.idProduto &&
          (i.controle ?? '') === (itemVolume.controle ?? ''),
      );

      if (existentePedido) {
        existentePedido.quantidade += itemVolume.quantidade;
      } else {
        pedidos.push({
          idProduto: itemVolume.idProduto,
          nomeProduto: itemVolume.descricaoProduto,
          imagem: itemVolume.imagem,
          quantidade: itemVolume.quantidade,
          unidade: itemVolume.unidade,
          controle: itemVolume.controle,
        } as ItemPedidoDTO);
      }
    });

    this.dataSourcePedidos._updateChangeSubscription();
    this.dataSourceConferidos._updateChangeSubscription();
  }

  removerVolume(volume: VolumeFrontDTO) {
    this.devolverItensDoVolume(volume);

    this.volumes = this.volumes.filter((v) => v !== volume);

    this.volumeAtivo = undefined as any;

    if (this.aindaHaItensParaConferir) {
      if (!this.volumes.length) {
        this.criarNovoVolume();
      } else {
        this.volumes.forEach((v) => (v.ativo = false));

        const ultimo = [...this.volumes].sort(
          (a, b) => b.numeroVolume - a.numeroVolume,
        )[0];

        ultimo.ativo = true;
        this.volumeAtivo = ultimo;

        this.volumes = this.volumes
          .filter((v) => v !== ultimo)
          .concat(ultimo)
          .reverse();
      }
    }
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

    const itemConferido = { ...this.itemSelecionado };

    this.dataSourcePedidos._updateChangeSubscription();
    this.dataSourceConferidos._updateChangeSubscription();

    this.adicionarItemAoVolume(itemConferido, qtdInformada);

    this.limparFormulario();

    this.verificarSeFinalizouConferencia();
  }

  verificarSeFinalizouConferencia() {
    if (this.dataSourcePedidos.data.length !== 0) return;

    this.removerVolumesVazios();

    this.volumes.forEach((v) => (v.ativo = false));
    this.volumeAtivo = undefined as any;

    this.volumes = [...this.volumes].sort(
      (a, b) => b.numeroVolume - a.numeroVolume,
    );
  }

  reordenarVolumesFinalizacao() {
    if (!this.volumes.length) return;

    this.volumes.forEach((v) => (v.ativo = false));
    this.volumeAtivo = undefined as any;

    this.volumes = [...this.volumes].sort(
      (a, b) => b.numeroVolume - a.numeroVolume,
    );
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

  criarNovoVolume() {
    if (this.existeVolumeVazio()) {
      return;
    }

    if (this.volumeAtivo) {
      this.volumeAtivo.ativo = false;
    }

    const novoVolume: VolumeFrontDTO = {
      numeroVolume: this.proximoNumeroVolume(),
      ativo: true,
      itens: [],

      largura: null,
      comprimento: null,
      altura: null,
      peso: null,
    };

    this.volumes.push(novoVolume);
    this.volumeAtivo = novoVolume;
  }
}
