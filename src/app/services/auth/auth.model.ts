export interface LoginRequest {
  usuario: string;
  senha: string;
}

export enum Perfil {
  ADMINISTRADOR,
  SEPARADOR,
}

export interface SessionData {
  token: string;
  nome: string;
  idUsuario: number;
  perfil: Perfil;
}

export interface RedefinirSenhaParams {
  senha: string;
  token: string;
  email: string;
}

export interface EsqueciMinhaSenhaParams {
  email: string;
}
