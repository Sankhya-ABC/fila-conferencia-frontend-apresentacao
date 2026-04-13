import { CommonModule } from '@angular/common';
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
import { Perfil } from '../../services/auth/auth.model';
import { FilaConferenciaDTO } from '../../services/conferencia/conferencia.model';
import { CodigoDescricao } from '../../services/dominio/dominio.model';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-usuario',
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
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
  ) {}

  // tabela
  displayedColumns: string[] = [
    'codigo',
    'foto',
    'nome',
    'email',
    'perfil',
    'ativo',
    'criadoEm',
    'atualizadoEm',
    'acoes',
  ];
  dataSource = new MatTableDataSource<FilaConferenciaDTO>([]);
  page = 0;
  perPage = 5;
  total = 0;

  // selects
  listPerfil: CodigoDescricao[] = [
    { codigo: null, descricao: 'Todos' },
    ...Object.values(Perfil).map((perfil) => {
      return { codigo: perfil, descricao: perfil };
    }),
  ];
  listStatus: CodigoDescricao[] = [
    { codigo: null, descricao: 'Todos' },
    { codigo: true, descricao: 'Ativo' },
    { codigo: false, descricao: 'Inativo' },
  ];

  // filters
  filters!: FormGroup;

  private criarForm(): void {
    this.filters = this.fb.group({
      nomeEmail: [],
      perfil: [],
      status: [],
    });
  }

  ngOnInit(): void {
    this.criarForm();
    this.applyFilter();
  }

  onLimparCampos(): void {
    this.criarForm();
  }

  applyFilter(): void {
    this.dataSource.data = [];

    const { nomeEmail, perfil, status } = this.filters.value;

    const params: any = {
      page: this.page,
      perPage: this.perPage,
    };

    if (nomeEmail) {
      params.nomeEmail = nomeEmail;
    }
    if (perfil) {
      params.perfil = perfil;
    }
    if (status) {
      params.status = status;
    }

    this.usuarioService.getUsuarios(params).subscribe({
      next: (resp: any) => {
        this.dataSource.data = resp.data;
        this.total = resp.total;
      },
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex;
    this.perPage = event.pageSize;
    this.applyFilter();
  }

  // requests
  atualizarStatus(usuario: any): void {
    this.usuarioService.toggleStatus(usuario.codigo).subscribe(() => {
      usuario.ativo = !usuario.ativo;
    });
  }

  redefinirAtivarLote(emails: string[]): void {
    this.usuarioService.redefinirAtivarLote(emails).subscribe();
  }
}
