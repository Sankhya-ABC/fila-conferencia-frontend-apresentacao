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

  // filters
  filters!: FormGroup;

  ngOnInit(): void {
    this.criarForm();

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

    this.filters.get('idParceiro')!.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        if (!value) {
          this.listParceiro = [];
          return;
        }

        this.parceiroService
          .getParceiros({ search: value })
          .subscribe((resp) => (this.listParceiro = resp));
      }
    });

    this.applyFilter();
  }

  private criarForm(): void {
    this.filters = this.fb.group({
      codigoStatus: [],
      numeroModial: [],
      numeroNota: [],
      numeroUnico: [],
      dataInicio: [],
      dataFim: [],
      idParceiro: [],
      codigoTipoMovimento: [],
      codigoTipoOperacao: [],
      codigoTipoEntrega: [],
    });
  }

  applyFilter(): void {
    this.dataSource.data = [];
    const params: FilaConferenciaFilter = this.filters.value;

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

    this.filaConferenciaService
      .getFilaConferencias(params)
      .subscribe((resp) => {
        this.dataSource.data = resp;
      });
  }

  // filters
  onLimparCampos(): void {
    this.filters.reset();
    this.applyFilter();
  }

  // actions
  onSeparar(fila: FilaConferenciaDTO): void {
    this.router.navigate([`/separacao/${fila?.numeroUnico}`]);
  }

  onImprimirEtiqueta(fila: FilaConferenciaDTO): void {
    console.log('Imprimir etiqueta clicado', fila);
  }

  // formats
  displayParceiro(parceiro?: ParceiroDTO): string {
    return parceiro ? `${parceiro.nome} - ${parceiro.cpfCnpj}` : '';
  }

  displayDate(date: string) {
    const day = date?.substring(0, 2);
    const month = date?.substring(2, 4);
    const year = date?.substring(4, 8);
    return `${day}/${month}/${year}`;
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
