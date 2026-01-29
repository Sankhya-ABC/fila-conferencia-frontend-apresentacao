import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CodigoDescricao } from '../../services/dto/dominio.model';
import {
  FilaConferenciaDTO,
  FilaConferenciaFilter,
} from '../../services/fila-conferencia/fila-conferencia.model';
import { FilaConferenciaService } from '../../services/fila-conferencia/fila-conferencia.service';
import { ParceiroDTO } from '../../services/parceiro/parceiro.model';
import { ParceiroService } from '../../services/parceiro/parceiro.service';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // FORM DE FILTROS
  filters!: FormGroup;

  // parceiro autocomplete
  parceiroCtrl = new FormControl('');
  parceiroSelecionado?: ParceiroDTO;
  listParceiro: ParceiroDTO[] = [];

  // selects
  listStatus: CodigoDescricao[] = [];
  listTipoMovimento: CodigoDescricao[] = [];
  listTipoOperacao: CodigoDescricao[] = [];
  listTipoEntrega: CodigoDescricao[] = [];

  ngOnInit(): void {
    this.criarForm();

    // selects
    this.filaConferenciaService
      .getStatus()
      .subscribe((data) => (this.listStatus = data));

    this.filaConferenciaService
      .getTipoMovimento()
      .subscribe((data) => (this.listTipoMovimento = data));

    this.filaConferenciaService
      .getTipoOperacao()
      .subscribe((data) => (this.listTipoOperacao = data));

    this.filaConferenciaService
      .getTipoEntrega()
      .subscribe((data) => (this.listTipoEntrega = data));

    this.parceiroCtrl.valueChanges.subscribe((value) => {
      if (!value || value.length < 2) {
        this.listParceiro = [];
        return;
      }

      this.parceiroService
        .getParceiros({ search: value })
        .subscribe((resp) => (this.listParceiro = resp));
    });

    this.applyFilter();
  }

  private criarForm(): void {
    this.filters = this.fb.group({
      codigoStatus: [],
      codigoTipoMovimento: [],
      codigoTipoOperacao: [],
      codigoTipoEntrega: [],
      numeroModial: [],
      numeroNota: [],
      numeroUnico: [],
      dataInicio: [],
      dataFim: [],
    });
  }

  onParceiroSelected(parceiro: ParceiroDTO): void {
    this.parceiroSelecionado = parceiro;
    this.applyFilter();
  }

  applyFilter(): void {
    const formValue = this.filters.value;

    const params: FilaConferenciaFilter = {
      ...formValue,
      idParceiro: this.parceiroSelecionado?.id,
    };

    Object.keys(params).forEach(
      (k) =>
        params[k as keyof FilaConferenciaFilter] == null &&
        delete params[k as keyof FilaConferenciaFilter],
    );

    this.filaConferenciaService
      .getFilaConferencias(params)
      .subscribe((resp) => {
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;
      });
  }

  // filters
  onLimparCampos(): void {
    this.filters.reset();
    this.parceiroSelecionado = undefined;
    this.parceiroCtrl.setValue('');
    this.applyFilter();
  }

  // actions
  onSeparar(fila: FilaConferenciaDTO): void {
    this.router.navigate([`/separacao/${fila?.numeroNota}`]);
  }

  onImprimirEtiqueta(fila: FilaConferenciaDTO): void {
    console.log('Imprimir etiqueta clicado', fila);
  }

  // tooltips
  tooltipSeparar(data: FilaConferenciaDTO): string {
    return data.codigoStatus === 'AC'
      ? `Separação`
      : `Disponível quando status é AGUARDANDO_CONFERENCIA`;
  }

  tooltipCubagem(data: FilaConferenciaDTO): string {
    return data.codigoStatus === 'A'
      ? `Separação`
      : `Disponível quando status é EM_ANDAMENTO`;
  }

  tooltipImprimir(data: FilaConferenciaDTO): string {
    return data.codigoStatus === 'F'
      ? `Impressão de etiqueta`
      : `Disponível quando status é FINALIZADO_OK`;
  }
}
