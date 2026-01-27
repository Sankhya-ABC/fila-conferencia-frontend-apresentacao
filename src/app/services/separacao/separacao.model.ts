import { IdNome } from '../dto/dominio.model';

export interface ItemPedidoDTO {
  produto: IdNome & {
    imagem?: string;
    codigoBarras: string;
    marca: IdNome;
  };
  medidas: {
    quantidade: string;
    unidade: string;
  };
  fornecedor: IdNome;
  controle?: string;
  complemento?: string;
}

export interface DadosGeraisPedidoDTO {
  vendedor: IdNome;
  parceiro: IdNome;
}
