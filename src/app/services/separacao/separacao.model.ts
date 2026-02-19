export interface ItemPedidoDTO {
  imagem?: string;

  idProduto: number;
  nomeProduto: string;

  codigoBarras?: string[];

  quantidade: number;
  unidade: string;

  idMarca: number;
  nomeMarca: string;

  idFornecedor: number;
  nomeFornecedor: string;

  controle: string;
  complemento: string;
}

export interface DadosBasicosPedidoDTO {
  numeroUnico: number;
  numeroNota: number;
  numeroModial: number;
  numeroConferencia: number;

  codigoStatus: string;
  codigoTipoMovimento: string;

  idParceiro: number;
  nomeParceiro: string;

  idVendedor: number;
  nomeVendedor: string;
}

export interface ItensConferidosResponse {
  idProduto: number;
  quantidade: number;
}

export interface PostIniciarConferenciaParams {
  idUsuario: number;
  numeroUnico: number;
}

export interface PostIniciarConferenciaResponse {
  numeroConferencia: number;
}
