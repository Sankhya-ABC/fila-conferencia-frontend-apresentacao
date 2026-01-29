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
import { Observable } from 'rxjs';
import { FilaConferenciaDTO } from '../../services/fila-conferencia/fila-conferencia.model';
import { FilaConferenciaService } from '../../services/fila-conferencia/fila-conferencia.service';
import { ParceiroService } from '../../services/parceiro/parceiro.service';
import { ParceiroDTO } from '../../services/parceiro/parceiro.model';
import { CodigoDescricao } from '../../services/dto/dominio.model';

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
    private parceiroService: ParceiroService,
    private router: Router,
  ) {}

  // tabela
  displayedColumns: string[] = [
    'acoes',
    'numeroUnico',
    'numeroNota',
    'numeroModial',
    'valorNota',
    'volume',
    'dataMovimento',
    'codigoStatus',
    'descricaoStatus',
    'codigoTipoMovimento',
    'descricaoTipoMovimento',
    'codigoTipoOperacao',
    'descricaoTipoOperacao',
    'codigoTipoEntrega',
    'descricaoTipoEntrega',
    'idEmpresa',
    'nomeEmpresa',
    'idParceiro',
    'nomeParceiro',
    'idVendedor',
    'nomeVendedor',
    'idUsuarioInclusao',
    'nomeUsuarioInclusao',
    'idUsuarioAlteracao',
    'nomeUsuarioAlteracao',
  ];
  dataSource = new MatTableDataSource<FilaConferenciaDTO>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // filtros
  statusFilter?: string;
  tipoMovimentoFilter?: string;
  tipoOperacaoFilter?: string;
  tipoEntregaFilter?: string;
  numeroModialFilter?: string;
  numeroNotaFilter?: string;
  numeroUnicoFilter?: string;
  dataInicioFilter?: Date;
  dataFimFilter?: Date;
  parceiroCtrl = new FormControl('');
  parceiroSelecionado?: ParceiroDTO;

  // selects
  listStatus: CodigoDescricao[] = [];
  listTipoMovimento: CodigoDescricao[] = [];
  listTipoOperacao: CodigoDescricao[] = [];
  listTipoEntrega: CodigoDescricao[] = [];

  // autocomplete
  listParceiro: ParceiroDTO[] = [];
  filteredParceiros$!: Observable<ParceiroDTO[]>;

  ngOnInit(): void {
    this.filaConferenciaService
      .getStatus()
      .then((resp) => (this.listStatus = resp.data));

    this.filaConferenciaService
      .getTipoMovimento()
      .then((resp) => (this.listTipoMovimento = resp.data));

    this.filaConferenciaService
      .getTipoOperacao()
      .then((resp) => (this.listTipoOperacao = resp.data));

    this.filaConferenciaService
      .getTipoEntrega()
      .then((resp) => (this.listTipoEntrega = resp.data));

    this.parceiroService
      .getParceiros({ search: this.parceiroCtrl.value || '' })
      .then((resp) => (this.listParceiro = resp.data));
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
    //
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

  tooltipSeparar(e: FilaConferenciaDTO): string {
    return e.codigoStatus === 'AC'
      ? `Separação`
      : `Disponível quando status é AGUARDANDO_CONFERENCIA}`;
  }

  tooltipCubagem(e: FilaConferenciaDTO): string {
    return e.codigoStatus === 'A'
      ? `Separação`
      : `Disponível quando status é EM_ANDAMENTO`;
  }

  tooltipImprimir(e: FilaConferenciaDTO): string {
    return e.codigoStatus === 'F'
      ? `Impressão de etiqueta`
      : `Disponível quando status é FINALIZADO_OK`;
  }
}
