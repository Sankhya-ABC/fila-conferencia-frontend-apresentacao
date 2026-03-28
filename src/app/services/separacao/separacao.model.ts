import { Dimensoes } from '../volume/volume.model';

export interface ItemPedidoDTO {
  imagem?: string;

  idProduto: number;
  nomeProduto: string;

  codigoBarras?: string[];

  unidade: string;
  quantidadeBase: number;
  quantidadeConvertida: number;

  quantidadeBaseConferida: number;
  quantidadeConvertidaConferida: number;

  idMarca: number;
  nomeMarca: string;

  idFornecedor: number;
  nomeFornecedor: string;

  controle: string;
  complemento: string;
}

export interface ItensConferidosResponse {
  idProduto: number;
  quantidadeConvertida: number;
}

export interface PostItemConferidoVolumeParams {
  numeroConferencia: number;
  numeroVolume: number;
  idProduto: number;
  controle: string;
  quantidadeConvertida: number;
  unidade: string;
}

export interface PostRemoverVolumeParams {
  numeroConferencia: number;
  numeroVolume: number;
}

export interface PostDevolverItemConferidoParams {
  numeroConferencia: number;
  numeroUnico: number;
  idProduto: number;
  controle: string;
}
