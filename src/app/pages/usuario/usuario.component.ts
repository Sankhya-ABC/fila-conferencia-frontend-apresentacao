import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent {
  form = new FormGroup({
    email: new FormControl(''),
  });

  usuarios: any[] = [];
  loading = false;

  constructor(private service: UsuarioService) {}

  buscar() {
    const email = this.form.value.email;

    if (!email) return;

    this.loading = true;

    this.service.buscarPorEmail(email).subscribe({
      next: (res: any) => {
        this.usuarios = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  ativar(usuario: any) {
    this.service.ativar(usuario.codigo).subscribe(() => {
      usuario.ativo = true;
    });
  }

  inativar(usuario: any) {
    this.service.inativar(usuario.codigo).subscribe(() => {
      usuario.ativo = false;
    });
  }

  resetSenha(usuario: any) {
    this.service.enviarReset(usuario.email).subscribe();
  }
}
