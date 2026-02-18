export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  nome: string;
  idUsuario: number;
  token: string;
}
