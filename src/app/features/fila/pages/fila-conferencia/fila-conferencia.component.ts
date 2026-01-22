import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  FilaConferenciaDTO,
  Status,
  TipoEntrega,
  TipoMovimento,
  TipoOperacao,
} from './fila-conferencia.model';
import { FilaConferenciaService } from './fila-conferencia.service';

@Component({
  selector: 'app-fila-conferencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './fila-conferencia.component.html',
  styleUrls: ['./fila-conferencia.component.scss'],
})
export class FilaConferenciaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
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

  statusFilter = Status.TODOS;
  tipoMovimentoFilter?: TipoMovimento;
  tipoOperacaoFilter?: TipoOperacao;
  tipoEntregaFilter?: TipoEntrega;

  statusOptions = Object.values(Status);
  tipoMovimentoOptions = Object.values(TipoMovimento);
  tipoOperacaoOptions = Object.values(TipoOperacao);
  tipoEntregaOptions = Object.values(TipoEntrega);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: FilaConferenciaService) {}

  ngOnInit(): void {
    this.service.getFila().subscribe((dados) => {
      this.dataSource.data = dados;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filterPredicate = (
      data: FilaConferenciaDTO,
      filter: string,
    ) => {
      const statusOk =
        this.statusFilter === Status.TODOS || data.status === this.statusFilter;
      const tipoMovOk =
        !this.tipoMovimentoFilter ||
        data.tipoMovimento === this.tipoMovimentoFilter;
      const tipoOpOk =
        !this.tipoOperacaoFilter ||
        data.tipoOperacao === this.tipoOperacaoFilter;
      const tipoEntOk =
        !this.tipoEntregaFilter || data.tipoEntrega === this.tipoEntregaFilter;
      return statusOk && tipoMovOk && tipoOpOk && tipoEntOk;
    };
    this.dataSource.filter = '' + Math.random();
  }

  onStatusChange(event: MatSelectChange) {
    this.statusFilter = event.value;
    this.applyFilter();
  }

  onTipoMovimentoChange(event: MatSelectChange) {
    this.tipoMovimentoFilter = event.value;
    this.applyFilter();
  }

  onTipoOperacaoChange(event: MatSelectChange) {
    this.tipoOperacaoFilter = event.value;
    this.applyFilter();
  }

  onTipoEntregaChange(event: MatSelectChange) {
    this.tipoEntregaFilter = event.value;
    this.applyFilter();
  }
}
