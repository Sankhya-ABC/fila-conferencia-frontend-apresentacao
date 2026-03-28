import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ArquivoService } from '../../services/arquivo/arquivo.service';
import { AuthService } from '../../services/auth/auth.service';
import { DadosBasicosPedidoDTO } from '../../services/conferencia/conferencia.model';
import { ConferenciaService } from '../../services/conferencia/conferencia.service';
import { ItemPedidoDTO } from '../../services/separacao/separacao.model';
import { SeparacaoService } from '../../services/separacao/separacao.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { VolumeFrontDTO } from '../../services/volume/volume.model';
import { VolumeService } from '../../services/volume/volume.service';

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
    private conferenciaService: ConferenciaService,
    private separacaoService: SeparacaoService,
    private arquivoService: ArquivoService,
    private volumeService: VolumeService,
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
    'quantidadeBase',
    'quantidadeConvertida',
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
    'quantidadeBase',
    'quantidadeConvertida',
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
  formConferencia!: FormGroup;
  formCubagem!: FormGroup;

  // control
  itemSelecionado: ItemPedidoDTO | null = null;
  controlesDisponiveis: string[] = [];
  produtoIdentificado = false;

  // template
  @ViewChild('modalItemNaoEncontrado')
  modalItemNaoEncontradoTpl!: TemplateRef<any>;

  @ViewChild('modalConferenciaFinalizada')
  modalConferenciaFinalizadaTpl!: TemplateRef<any>;
  dialogRefConferenciaFinalizada?: MatDialogRef<ModalComponent>;

  ngOnInit(): void {
    this.numeroUnico = Number(this.route.snapshot.paramMap.get('numeroUnico'));

    this.formConferencia = this.fb.group({
      identificador: [''],
      quantidadeConvertida: [null],
      controle: [''],
    });

    this.formCubagem = this.fb.group({
      quantidade: [null, Validators.min(1)],
      largura: [null, Validators.min(0.1)],
      comprimento: [null, Validators.min(0.1)],
      altura: [null, Validators.min(0.1)],
      peso: [null, Validators.min(0.1)],
    });

    if (!this.numeroUnico) return;

    this.inicializarConferencia();
  }

  // requests
  inicializarConferencia() {
    this.conferenciaService.getDadosBasicos(this.numeroUnico!).subscribe({
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
    this.conferenciaService
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

    this.conferenciaService.getDadosBasicos(this.numeroUnico!).subscribe({
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

        const mapConferidos = new Map<string, number>();

        itensConferidos.forEach((i) => {
          const k = chave(i);
          const atual = mapConferidos.get(k) || 0;
          mapConferidos.set(k, atual + Number(i.quantidadeConvertida));
        });

        const pedidosAtualizados: ItemPedidoDTO[] = [];
        const conferidos: ItemPedidoDTO[] = [];

        this.dataSourcePedidos.data.forEach((item) => {
          const qtdConferida = mapConferidos.get(chave(item)) || 0;

          if (qtdConferida > 0) {
            const fator = item.quantidadeBase / item.quantidadeConvertida;

            const qtdBaseConferida = Number((qtdConferida * fator).toFixed(5));

            conferidos.push({
              ...item,
              quantidadeConvertida: qtdConferida,
              quantidadeBase: qtdBaseConferida,
            });

            const restanteConvertido = Number(
              (item.quantidadeConvertida - qtdConferida).toFixed(5),
            );

            const restanteBase = Number(
              (item.quantidadeBase - qtdBaseConferida).toFixed(5),
            );

            if (restanteConvertido > 0) {
              pedidosAtualizados.push({
                ...item,
                quantidadeConvertida: restanteConvertido,
                quantidadeBase: restanteBase,
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
    this.volumeService.getVolumes(numeroConferencia).subscribe({
      next: (volumes) => {
        this.volumes = volumes.map((v) => ({
          ...v,
          _alturaAntiga: v.altura,
          _larguraAntiga: v.largura,
          _comprimentoAntigo: v.comprimento,
          _pesoAntigo: v.peso,
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

  get quantidadeConvertidaCtrl() {
    return this.formConferencia.get('quantidadeConvertida');
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
        itensVolumes.set(
          k,
          (itensVolumes.get(k) || 0) + i.quantidadeConvertida,
        );
      });
    });

    return this.dataSourceConferidos.data.every((i) => {
      return itensVolumes.get(chave(i)) === i.quantidadeConvertida;
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

    if (this.isVolumesDetalhados()) {
      return this.todosItensNosVolumes && this.todosVolumesComDimensoes;
    }

    if (this.isVolumesNaoDetalhados()) {
      return this.todosVolumesComDimensoes;
    }

    return true;
  }

  // acoes
  finalizarConferencia() {
    this.conferenciaService
      .postFinalizarConferencia({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
      })
      .subscribe({
        next: () => {
          this.abrirModalConferenciaFinalizada();
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
    const identificadorRaw = this.formConferencia.get('identificador')?.value;
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

    this.formConferencia.patchValue({
      identificador: item.idProduto,
      controle: this.normalizarControle(item.controle),
    });

    this.produtoIdentificado = true;

    if (this.quantidadeConvertidaCtrl?.value) {
      this.onBlurQuantidadeConvertida();
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

    this.formConferencia.patchValue({
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
    this.volumeService
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

  onBlurQuantidadeConvertida() {
    const ctrl = this.quantidadeConvertidaCtrl;
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

    const max = Number(this.itemSelecionado.quantidadeConvertida);

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
      if (this.isVolumesDetalhados()) {
        this.criarNovoVolume();
      }
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

  adicionarItemAoVolume(item: ItemPedidoDTO, quantidadeConvertida: number) {
    this.garantirVolumeAtivo();

    const existente = this.volumeAtivo.itens.find((i) =>
      this.mesmaChaveItem(i, item),
    );

    if (existente) {
      existente.quantidadeConvertida += quantidadeConvertida;
    } else {
      this.volumeAtivo.itens.push({
        idProduto: item.idProduto,
        descricaoProduto: item.nomeProduto,
        imagem: item.imagem || null,
        quantidadeConvertida,
        quantidadeBase: item.quantidadeBase,
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
      })
      .subscribe({
        next: () => {
          this.carregarEstadoConferencia();
        },
      });
  }

  onConferir() {
    if (!this.itemSelecionado) return;

    if (this.isVolumesDetalhados() && !this.volumeAtivo) return;

    const quantidadeConvertida = Number(this.quantidadeConvertidaCtrl?.value);
    if (!quantidadeConvertida || quantidadeConvertida <= 0) return;

    this.separacaoService
      .postItemConferidoVolume({
        numeroConferencia: this.dadosGerais.numeroConferencia!,
        numeroVolume: this.volumeAtivo?.numeroVolume || 1,
        idProduto: this.itemSelecionado.idProduto,
        controle: this.itemSelecionado.controle ?? '',
        quantidadeConvertida,
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

    this.formConferencia.reset();

    Object.values(this.formConferencia.controls).forEach((ctrl) => {
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

  abrirModalConferenciaFinalizada() {
    this.dialogRefConferenciaFinalizada = this.dialog.open(ModalComponent, {
      data: {
        template: this.modalConferenciaFinalizadaTpl,
      },
      disableClose: true,
    });
  }

  voltarParaFila() {
    this.dialogRefConferenciaFinalizada?.close();
    this.router.navigate(['/fila-conferencia']);
  }

  imprimirEtiquetas() {
    const numeroConferencia = this.dadosGerais.numeroConferencia!;

    this.arquivoService.downloadEtiqueta(numeroConferencia).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `etiquetas_conferencia_${numeroConferencia}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);

        this.dialogRefConferenciaFinalizada?.close();
      },
      error: (err) => {
        console.error('Erro ao baixar etiquetas', err);
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

  // cubagem de pedido
  isVolumesDetalhados(): boolean {
    return (
      this.dadosGerais?.codigoTipoMovimento === 'P' &&
      this.dadosGerais?.descricaoTipoOperacao !== 'CUBAGEM DE PEDIDO'
    );
  }

  isVolumesNaoDetalhados(): boolean {
    return (
      this.dadosGerais?.codigoTipoMovimento === 'P' &&
      this.dadosGerais?.descricaoTipoOperacao === 'CUBAGEM DE PEDIDO'
    );
  }

  get quantidadeCubagemCtrl() {
    return this.formCubagem.get('quantidade');
  }

  get larguraCubagemCtrl() {
    return this.formCubagem.get('largura');
  }

  get comprimentoCubagemCtrl() {
    return this.formCubagem.get('comprimento');
  }

  get alturaCubagemCtrl() {
    return this.formCubagem.get('altura');
  }

  get pesoCubagemCtrl() {
    return this.formCubagem.get('peso');
  }

  onBlurFieldsFormCubagem(
    key: 'quantidade' | 'largura' | 'comprimento' | 'altura' | 'peso',
  ) {
    const ctrl = this.formCubagem.get(key);

    if (!ctrl) return;

    const value = ctrl.value;

    if (value === null || value === '') {
      ctrl.setErrors(null);
      return;
    }

    const valor = Number(value);

    if (Number.isNaN(valor)) {
      ctrl.setErrors({ invalido: true });
      return;
    }

    if (valor <= 0) {
      ctrl.setErrors({ menorOuIgualAZero: true });
      return;
    }

    ctrl.setErrors(null);
  }

  isGerarVolumeLoteDisabled(): boolean {
    const values = [
      this.quantidadeCubagemCtrl?.value,
      this.larguraCubagemCtrl?.value,
      this.comprimentoCubagemCtrl?.value,
      this.alturaCubagemCtrl?.value,
      this.pesoCubagemCtrl?.value,
    ];

    return values.some((v) => !v || Number(v) <= 0);
  }

  gerarVolumesLote() {
    if (!this.formCubagem.valid) return;

    const payload = {
      numeroConferencia: this.dadosGerais.numeroConferencia,
      quantidadeLote: this.formCubagem.value.quantidade,
      altura: this.formCubagem.value.altura,
      largura: this.formCubagem.value.largura,
      comprimento: this.formCubagem.value.comprimento,
      peso: this.formCubagem.value.peso,
    };

    this.volumeService.gerarVolumesLote(payload).subscribe(() => {
      this.carregarVolumes(this.dadosGerais.numeroConferencia);
      this.formCubagem.reset();
    });
  }

  deletarVolumeLote(volume: any) {
    const payload = {
      numeroConferencia: this.dadosGerais.numeroConferencia,
      altura: volume.altura,
      largura: volume.largura,
      comprimento: volume.comprimento,
      peso: volume.peso,
    };

    this.volumeService.deletarVolumesLote(payload).subscribe(() => {
      this.carregarVolumes(this.dadosGerais.numeroConferencia);
    });
  }

  salvarDimensoesVolumeLote(volume: any) {
    const payload = {
      numeroConferencia: this.dadosGerais.numeroConferencia,
      numeroVolume: null,

      alturaAntiga: volume._alturaAntiga ?? volume.altura,
      larguraAntiga: volume._larguraAntiga ?? volume.largura,
      comprimentoAntigo: volume._comprimentoAntigo ?? volume.comprimento,
      pesoAntigo: volume._pesoAntigo ?? volume.peso,

      altura: volume.altura,
      largura: volume.largura,
      comprimento: volume.comprimento,
      peso: volume.peso,
    };

    this.volumeService.postAtualizarDimensoesVolume(payload).subscribe(() => {
      volume._alturaAntiga = volume.altura;
      volume._larguraAntiga = volume.largura;
      volume._comprimentoAntigo = volume.comprimento;
      volume._pesoAntigo = volume.peso;
    });
  }
}
