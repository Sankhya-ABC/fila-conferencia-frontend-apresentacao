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

export interface PostIniciarConferenciaParams {
  idUsuario: number;
  numeroNota: number;
  numeroUnico: number;
}

export interface PostIniciarConferenciaResponse {
  numeroConferencia: number;
}
