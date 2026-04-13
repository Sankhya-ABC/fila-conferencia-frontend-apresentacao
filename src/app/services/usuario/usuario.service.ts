import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  getUsuarios(params: any) {
    return this.http.get<{ data: Usuario[]; total: number }>('/usuarios', {
      params,
    });
  }

  toggleStatus(codigo: number) {
    return this.http.patch(`/usuarios/${codigo}/status`, {});
  }

  redefinirAtivarLote(emails: string[]) {
    return this.http.post(`/usuarios/redefinir-ativar-lote`, { emails });
  }
}
