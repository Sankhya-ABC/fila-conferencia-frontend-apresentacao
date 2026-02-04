export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  nome: string;
  idUsuario: string;
  token: string;
}
