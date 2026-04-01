import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { CodigoDescricao } from '../../services/dominio/dominio.model';
import { EmpresaDTO } from '../../services/empresa/empresa.model';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {
  FilaConferenciaDTO,
  FilaConferenciaFilter,
} from '../../services/conferencia/conferencia.model';
import { ConferenciaService } from '../../services/conferencia/conferencia.service';
import { ParceiroDTO } from '../../services/parceiro/parceiro.model';
import { ParceiroService } from '../../services/parceiro/parceiro.service';
import { SeparacaoService } from '../../services/separacao/separacao.service';
import { DominioService } from '../../services/dominio/dominio.service';
import { ArquivoService } from '../../services/arquivo/arquivo.service';

@Component({
  selector: 'app-fila-conferencia',
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
    MatButtonModule,
  ],
  templateUrl: './fila-conferencia.component.html',
  styleUrls: ['./fila-conferencia.component.scss'],
})
export class FilaConferenciaComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private conferenciaService: ConferenciaService,
    private dominioService: DominioService,
    private parceiroService: ParceiroService,
    private empresaService: EmpresaService,
    private router: Router,
    private arquivoService: ArquivoService,
  ) {}

  // tabela
  displayedColumns: string[] = [
    'acoes',
    'numeroUnico',
    'numeroNota',
    'numeroModial',
    'numeroConferencia',
    'valorNota',
    'volume',
    'dataMovimento',
    // 'codigoStatus',
    'descricaoStatus',
    // 'codigoTipoMovimento',
    'descricaoTipoMovimento',
    // 'codigoTipoOperacao',
    'descricaoTipoOperacao',
    // 'codigoTipoEntrega',
    'descricaoTipoEntrega',
    // 'idEmpresa',
    'nomeEmpresa',
    // 'idParceiro',
    'nomeParceiro',
    // 'idVendedor',
    'nomeVendedor',
    // 'idUsuarioInclusao',
    'nomeUsuarioInclusao',
    // 'idUsuarioAlteracao',
    'nomeUsuarioAlteracao',
  ];
  dataSource = new MatTableDataSource<FilaConferenciaDTO>([]);

  // selects
  listStatus: CodigoDescricao[] = [];
  listTipoMovimento: CodigoDescricao[] = [];
  listTipoOperacao: CodigoDescricao[] = [];
  listTipoEntrega: CodigoDescricao[] = [];
  listParceiro: ParceiroDTO[] = [];
  listEmpresa: EmpresaDTO[] = [];

  // filters
  filters!: FormGroup;

  // requests
  ngOnInit(): void {
    this.criarForm();

    this.dominioService
      .getStatus()
      .subscribe((data) => (this.listStatus = data));

    this.dominioService
      .getTipoMovimento()
      .subscribe((data) => (this.listTipoMovimento = data));

    this.dominioService
      .getTipoOperacao()
      .subscribe((data) => (this.listTipoOperacao = data));

    this.dominioService
      .getTipoEntrega()
      .subscribe((data) => (this.listTipoEntrega = data));

    this.filters
      .get('idParceiro')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (!value || typeof value !== 'string') {
          this.listParceiro = [];
          return;
        }

        this.parceiroService
          .getParceiros({ search: value })
          .subscribe((resp) => (this.listParceiro = resp));
      });

    this.filters
      .get('idEmpresa')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (!value || typeof value !== 'string') {
          this.listEmpresa = [];
          return;
        }

        this.empresaService
          .getEmpresas({ search: value })
          .subscribe((resp) => (this.listEmpresa = resp));
      });

    this.applyFilter();
  }

  private criarForm(): void {
    this.filters = this.fb.group({
      codigoStatus: [['A', 'AC', 'R', 'RA', 'RD', 'Z']],
      numeroModial: [],
      numeroNota: [],
      numeroUnico: [],
      dataInicio: [],
      dataFim: [],
      idParceiro: [],
      idEmpresa: [],
      codigoTipoMovimento: [],
      codigoTipoOperacao: [],
      codigoTipoEntrega: [],
    });
  }

  // auto select filtro
  displayEmpresa(empresa?: EmpresaDTO): string {
    return empresa ? `${empresa.nome} - ${empresa.cpfCnpj}` : '';
  }

  displayParceiro(parceiro?: ParceiroDTO): string {
    return parceiro ? `${parceiro.nome} - ${parceiro.cpfCnpj}` : '';
  }

  applyFilter(): void {
    this.dataSource.data = [];

    const rawParams = this.filters.value;

    const params: FilaConferenciaFilter = {
      ...rawParams,
      idParceiro: rawParams.idParceiro?.id,
      idEmpresa: rawParams.idEmpresa?.id,
    };

    params.dataInicio = params.dataInicio
      ? formatDate(params.dataInicio, 'yyyy-MM-dd', 'en-US')
      : undefined;

    params.dataFim = params.dataFim
      ? formatDate(params.dataFim, 'yyyy-MM-dd', 'en-US')
      : undefined;

    Object.keys(params).forEach(
      (k) =>
        params[k as keyof FilaConferenciaFilter] == null &&
        delete params[k as keyof FilaConferenciaFilter],
    );

    this.conferenciaService.getFilaConferencias(params).subscribe({
      next: (resp) => (this.dataSource.data = resp),
      error: () => (this.dataSource.data = []),
    });
  }

  // filters
  onLimparCampos(): void {
    this.criarForm();
  }

  // actions
  onSeparar(fila: FilaConferenciaDTO): void {
    this.router.navigate([`/separacao/${fila?.numeroUnico}`]);
  }

  onImprimirEtiqueta(fila: FilaConferenciaDTO): void {
    const numeroConferencia = fila?.numeroConferencia!;

    this.arquivoService.downloadEtiqueta(numeroConferencia).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `etiquetas_conferencia_${numeroConferencia}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar etiquetas', err);
      },
    });
  }

  // formats
  displayDate(date: string) {
    const day = date?.substring(0, 2);
    const month = date?.substring(2, 4);
    const year = date?.substring(4, 8);
    return `${day}/${month}/${year}`;
  }

  // tooltips
  tooltipSeparar(data: FilaConferenciaDTO): string {
    return data.codigoStatus === 'AC' || data.codigoStatus === 'A'
      ? `Separação`
      : `Disponível quando status é AGUARDANDO_CONFERENCIA ou EM_ANDAMENTO`;
  }

  tooltipImprimir(data: FilaConferenciaDTO): string {
    return data.codigoStatus === 'F'
      ? `Impressão de etiqueta`
      : `Disponível quando status é FINALIZADO_OK`;
  }
}
