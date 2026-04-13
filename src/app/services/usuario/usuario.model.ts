import { Perfil } from '../auth/auth.model';

export interface Usuario {
  id: string;
  codigo: number;
  nome: string;
  email: string;
  foto: string;
  perfil: Perfil;
  senha: string;
  ativo: boolean;
  resetToken: string;
  resetTokenExp: string;
  createdAt: string;
  updatedAt: string;
}
