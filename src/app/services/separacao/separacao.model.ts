import { IdNome } from '../dto/dominio.model';

export interface ItemPedidoDTO {
  imagem?: string;

  idProduto: string;
  nomeProduto: string;

  codigoBarras?: string[];

  quantidade: string;
  unidade: string;

  idMarca: string;
  nomeMarca: string;

  idFornecedor: string;
  nomeFornecedor: string;

  controle: string;
  complemento: string;
}

export interface DadosGeraisPedidoDTO {
  vendedor: IdNome;
  parceiro: IdNome;
}
