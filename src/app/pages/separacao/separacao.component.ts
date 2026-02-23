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
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
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

    if (!this.numeroUnico) return;

    this.inicializarConferencia();
  }

  // requests
  inicializarConferencia() {
    this.separacaoService.getDadosBasicos(this.numeroUnico!).subscribe({
      next: (dados) => {
        this.dadosGerais = dados;

        if (dados.codigoStatus !== 'AC' && dados.codigoStatus !== 'A') {
          this.router.navigate(['/fila-conferencia']);
        }

        if (dados.codigoStatus === 'AC') {
          this.iniciarConferencia(dados.numeroUnico);
          return;
        }

        this.carregarEstadoConferencia();
      },
      error: (err) => console.error(err),
    });
  }

  private iniciarConferencia(numeroUnico: number) {
    this.separacaoService
      .postIniciarConferencia({
        idUsuario: this.idUsuario,
        numeroUnico,
      })
      .subscribe({
        next: () => {
          this.inicializarConferencia();
        },
        error: (err) => console.error(err),
      });
  }

  carregarEstadoConferencia() {
    if (!this.dadosGerais?.numeroUnico) return;

    this.separacaoService.getDadosBasicos(this.numeroUnico!).subscribe({
      next: (dados) => {
        this.dadosGerais = dados;

        if (!dados.numeroConferencia) return;

        this.separacaoService.getItensPedido(dados.numeroUnico).subscribe({
          next: (itensPedido) => {
            this.dataSourcePedidos.data = itensPedido;

            this.carregarItensConferidos(dados.numeroConferencia);
            this.carregarVolumes(dados.numeroConferencia);
          },
        });
      },
    });
  }

  carregarItensPedido(numeroUnico: number) {
    this.separacaoService.getItensPedido(numeroUnico).subscribe({
      next: (itens) => (this.dataSourcePedidos.data = itens),
    });
  }

  carregarItensConferidos(numeroConferencia: number) {
    this.separacaoService.getItensConferidos(numeroConferencia).subscribe({
      next: (itensConferidos) => {
        const chave = (i: { idProduto: number; controle?: string }) =>
          `${i.idProduto}#${i.controle ?? ''}`;

        const mapConferidos = new Map(
          itensConferidos.map((i) => [chave(i), i.quantidade]),
        );

        const pedidosAtualizados: ItemPedidoDTO[] = [];
        const conferidos: ItemPedidoDTO[] = [];

        this.dataSourcePedidos.data.forEach((item) => {
          const qtdConferida = mapConferidos.get(chave(item));

          if (qtdConferida) {
            conferidos.push({
              ...item,
              quantidade: qtdConferida,
            });

            const restante = item.quantidade - qtdConferida;

            if (restante > 0) {
              pedidosAtualizados.push({
                ...item,
                quantidade: restante,
              });
            }
          } else {
            pedidosAtualizados.push(item);
          }
        });

        this.dataSourcePedidos.data = pedidosAtualizados;
        this.dataSourceConferidos.data = conferidos;
      },
    });
  }

  carregarVolumes(numeroConferencia: number) {
    this.separacaoService.getVolumes(numeroConferencia).subscribe({
      next: (volumes) => {
        this.volumes = volumes.map((v) => ({
          ...v,
          ativo: false,
        }));
        this.garantirVolumeAtivo();
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
  finalizarConferencia() {
    this.separacaoService
      .postFinalizarConferencia({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/fila-conferencia']);
        },
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
    this.separacaoService
      .postDevolverItemConferido({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
        numeroUnico: this.numeroUnico!,
        idProduto: item.idProduto,
        controle: item.controle ?? '',
      })
      .subscribe({
        next: () => {
          this.carregarEstadoConferencia();
        },
        error: (err) => console.error(err),
      });
  }

  salvarDimensoes(volume: VolumeFrontDTO) {
    this.separacaoService
      .postAtualizarDimensoesVolume({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
        numeroVolume: volume.numeroVolume,
        largura: volume.largura,
        comprimento: volume.comprimento,
        altura: volume.altura,
        peso: volume.peso,
      })
      .subscribe();
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

  removerVolume(volume: VolumeFrontDTO) {
    this.separacaoService
      .postRemoverVolume({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
        numeroVolume: volume.numeroVolume,
        numeroUnico: this.numeroUnico!,
      })
      .subscribe({
        next: () => {
          this.carregarEstadoConferencia();
        },
      });
  }

  onConferir() {
    if (!this.itemSelecionado || !this.volumeAtivo) return;

    const quantidade = Number(this.quantidadeCtrl?.value);
    if (!quantidade || quantidade <= 0) return;

    this.separacaoService
      .postItemConferidoVolume({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
        numeroVolume: this.volumeAtivo.numeroVolume,
        idProduto: this.itemSelecionado.idProduto,
        controle: this.itemSelecionado.controle ?? '',
        quantidade,
        unidade: this.itemSelecionado.unidade,
      })
      .subscribe({
        next: () => {
          this.limparFormulario();
          this.carregarEstadoConferencia();
        },
        error: (err) => console.error(err),
      });
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
