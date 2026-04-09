export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  nome: string;
  idUsuario: number;
  token: string;
}

export interface RedefinirSenhaParams {
  senha: string;
  token: string;
  email: string;
}
