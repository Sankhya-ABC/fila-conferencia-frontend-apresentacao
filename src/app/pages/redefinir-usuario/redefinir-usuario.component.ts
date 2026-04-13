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
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MatChipsModule } from '@angular/material/chips';
import { ToastService } from '../../services/toast/toast.service';

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
    MatChipsModule,
  ],
  templateUrl: './redefinir-usuario.component.html',
  styleUrls: ['./redefinir-usuario.component.scss'],
})
export class RedefinirUsuarioComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toast: ToastService,
  ) {}

  // filters
  filters!: FormGroup;
  emails: string[] = [];

  adicionarEmail(event: any) {
    const value = (event.value || '').trim();

    if (value && this.validarEmail(value)) {
      this.emails.push(value);
    }

    event.chipInput!.clear();
  }

  removerEmail(email: string) {
    this.emails = this.emails.filter((e) => e !== email);
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private criarForm(): void {
    this.filters = this.fb.group({
      emails: [],
    });
  }

  ngOnInit(): void {
    this.criarForm();
  }

  onLimparCampos(): void {
    this.criarForm();
  }

  redefinirAtivarLote() {
    this.usuarioService.redefinirAtivarLote(this.emails).subscribe({
      next: (resp: any) => {
        if (resp.erro.length) {
          this.toast.open(
            'Parcial',
            `Não encontrados: ${resp.erro.join(', ')}`,
            'error',
          );
        }

        if (resp.sucesso.length) {
          setTimeout(
            () => {
              this.toast.open(
                'Sucesso',
                `Emails enviados: ${resp.sucesso.join(', ')}`,
                'success',
              );
            },
            resp.erro.length ? 1200 : 0,
          );
        }
      },
    });
  }
}
