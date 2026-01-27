import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import {
  FilaConferenciaDTO,
  ParceiroDTO,
  Status,
  TipoEntrega,
  TipoMovimento,
  TipoOperacao,
} from '../../services/fila-conferencia/fila-conferencia.model';
import { FilaConferenciaService } from '../../services/fila-conferencia/fila-conferencia.service';

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
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './fila-conferencia.component.html',
  styleUrls: ['./fila-conferencia.component.scss'],
})
export class FilaConferenciaComponent implements OnInit {
  constructor(
    private filaConferenciaService: FilaConferenciaService,
    private router: Router,
  ) {}

  Status = Status;

  // tabela
  displayedColumns: string[] = [
    'acoes',
    'status',
    'idEmpresa',
    'numeroModial',
    'numeroNota',
    'numeroUnico',
    'dataMovimento',
    'tipoMovimento',
    'tipoOperacao',
    'tipoEntrega',
    'nomeParceiro',
    'numeroParceiro',
    'numeroVendedor',
    'valorNota',
    'volume',
    'idUsuarioInclusao',
    'idUsuarioAlteracao',
  ];
  dataSource = new MatTableDataSource<FilaConferenciaDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // filtros
  statusFilter?: Status;
  tipoMovimentoFilter?: TipoMovimento;
  tipoOperacaoFilter?: TipoOperacao;
  tipoEntregaFilter?: TipoEntrega;
  numeroModialFilter?: string;
  numeroNotaFilter?: string;
  numeroUnicoFilter?: string;
  dataInicioFilter?: Date;
  dataFimFilter?: Date;
  parceiroCtrl = new FormControl('');
  parceiroSelecionado?: ParceiroDTO;

  // selects
  statusOptions = Object.values(Status);
  tipoMovimentoOptions = Object.values(TipoMovimento);
  tipoOperacaoOptions = Object.values(TipoOperacao);
  tipoEntregaOptions = Object.values(TipoEntrega);

  // autocomplete
  parceiros: ParceiroDTO[] = [];
  filteredParceiros$!: Observable<ParceiroDTO[]>;

  ngOnInit(): void {
    this.filaConferenciaService.getFila().subscribe((dados) => {
      this.dataSource.data = dados;
      this.dataSource.paginator = this.paginator;
    });

    this.filaConferenciaService.getParceiros().subscribe((data: any) => {
      this.parceiros = data;
      this.filteredParceiros$ = this.parceiroCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterParceiros(value ?? '')),
      );
    });
  }

  private _filterParceiros(value: string | ParceiroDTO): ParceiroDTO[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value.nome.toLowerCase();
    return this.parceiros.filter((p) =>
      p.nome.toLowerCase().includes(filterValue),
    );
  }

  displayParceiro(parceiro: ParceiroDTO): string {
    return parceiro ? parceiro.nome : '';
  }

  onParceiroSelected(parceiro: ParceiroDTO) {
    this.parceiroSelecionado = parceiro;
    this.applyFilter();
  }

  // filtros
  onLimparCampos(): void {
    this.statusFilter = undefined;
    this.numeroModialFilter = undefined;
    this.numeroNotaFilter = undefined;
    this.numeroUnicoFilter = undefined;

    this.tipoMovimentoFilter = undefined;
    this.tipoOperacaoFilter = undefined;
    this.tipoEntregaFilter = undefined;

    this.dataInicioFilter = undefined;
    this.dataFimFilter = undefined;

    this.parceiroCtrl.setValue(null);

    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: FilaConferenciaDTO) => {
      const statusOk = !this.statusFilter || data.status === this.statusFilter;
      const tipoMovOk =
        !this.tipoMovimentoFilter ||
        data.tipoMovimento === this.tipoMovimentoFilter;
      const tipoOpOk =
        !this.tipoOperacaoFilter ||
        data.tipoOperacao === this.tipoOperacaoFilter;
      const tipoEntOk =
        !this.tipoEntregaFilter || data.tipoEntrega === this.tipoEntregaFilter;

      const modialOk =
        !this.numeroModialFilter ||
        data.numeroModial.includes(this.numeroModialFilter);
      const notaOk =
        !this.numeroNotaFilter ||
        data.numeroNota.includes(this.numeroNotaFilter);
      const unicoOk =
        !this.numeroUnicoFilter ||
        data.numeroUnico.includes(this.numeroUnicoFilter);
      const parceiroOk =
        !this.parceiroSelecionado ||
        data.nomeParceiro === this.parceiroSelecionado.nome;

      const dataInicioOk =
        !this.dataInicioFilter ||
        new Date(data.dataMovimento) >= this.dataInicioFilter;
      const dataFimOk =
        !this.dataFimFilter ||
        new Date(data.dataMovimento) <= this.dataFimFilter;

      return (
        statusOk &&
        tipoMovOk &&
        tipoOpOk &&
        tipoEntOk &&
        modialOk &&
        notaOk &&
        unicoOk &&
        parceiroOk &&
        dataInicioOk &&
        dataFimOk
      );
    };

    this.dataSource.filter = '' + Math.random();
  }

  onStatusChange(value: any) {
    this.statusFilter = value;
    this.applyFilter();
  }

  onTipoMovimentoChange(value: any) {
    this.tipoMovimentoFilter = value;
    this.applyFilter();
  }

  onTipoOperacaoChange(value: any) {
    this.tipoOperacaoFilter = value;
    this.applyFilter();
  }

  onTipoEntregaChange(value: any) {
    this.tipoEntregaFilter = value;
    this.applyFilter();
  }

  // ações
  onSeparar(fila: FilaConferenciaDTO) {
    this.router.navigate([`/separacao/${fila?.numeroNota}`]);
  }

  onImprimirEtiqueta(fila: FilaConferenciaDTO) {
    console.log('Imprimir etiqueta clicado', fila);
  }

  tooltipSeparar(e: any): string {
    return e.status === Status.AGUARDANDO_CONFERENCIA
      ? `Separação`
      : `Disponível quando status é ${Status.AGUARDANDO_CONFERENCIA}`;
  }

  tooltipCubagem(e: any): string {
    return e.status === Status.EM_ANDAMENTO
      ? `Separação`
      : `Disponível quando status é ${Status.EM_ANDAMENTO}`;
  }

  tooltipImprimir(e: any): string {
    return e.status === Status.FINALIZADO
      ? `Impressão de etiqueta`
      : `Disponível quando status é ${Status.FINALIZADO}`;
  }
}
