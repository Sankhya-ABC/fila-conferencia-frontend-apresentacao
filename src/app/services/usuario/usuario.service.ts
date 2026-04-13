import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  buscarPorEmail(email: string) {
    return this.http.get(`/api/usuarios?email=${email}`);
  }

  ativar(id: number) {
    return this.http.patch(`/api/usuarios/${id}/ativar`, {});
  }

  inativar(id: number) {
    return this.http.patch(`/api/usuarios/${id}/inativar`, {});
  }

  enviarReset(email: string) {
    return this.http.post(`/api/auths/esqueci-minha-senha`, { email });
  }
}
