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

export interface VolumeItemDTO {
  idProduto: number;
  descricaoProduto: string;
  imagem: string | null;
  quantidade: number;
  unidade: string;
  controle?: string;
}

export interface Dimensoes {
  largura: number | null;
  comprimento: number | null;
  altura: number | null;
  peso: number | null;
}

export interface VolumeDTO extends Dimensoes {
  numeroVolume: number;
  itens: VolumeItemDTO[];

  largura: number | null;
  comprimento: number | null;
  altura: number | null;
  peso: number | null;
}

export interface PostAtualizarDimensoesVolumeParams extends Dimensoes {
  numeroConferencia: number;
  numeroVolume: number;
}

export interface VolumeFrontDTO extends VolumeDTO {
  ativo?: boolean;
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

export interface PostFinalizarConferenciaParams {
  numeroConferencia: number;
}

export interface PostItemConferidoVolumeParams {
  numeroConferencia: number;
  numeroVolume: number;
  idProduto: number;
  controle: string;
  quantidade: number;
  unidade: string;
}

export interface PostRemoverVolumeParams {
  numeroConferencia: number;
  numeroVolume: number;
  numeroUnico: number;
}

export interface PostDevolverItemConferidoParams {
  numeroConferencia: number;
  numeroUnico: number;
  idProduto: number;
  controle: string;
}
