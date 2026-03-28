export interface Dimensoes {
  largura: number | null;
  comprimento: number | null;
  altura: number | null;
  peso: number | null;
}

export interface VolumeItemDTO {
  idProduto: number;
  descricaoProduto: string;
  imagem: string | null;
  quantidadeConvertida: number;
  quantidadeBase: number;
  unidade: string;
  controle?: string;
}

export interface VolumeDTO extends Dimensoes {
  quantidadeLote?: number;
  numeroVolume: number;
  itens: VolumeItemDTO[];

  largura: number | null;
  comprimento: number | null;
  altura: number | null;
  peso: number | null;
}

export interface VolumeFrontDTO extends VolumeDTO {
  ativo?: boolean;
}

export interface PostAtualizarDimensoesVolumeDetalhadoParams extends Dimensoes {
  numeroConferencia: number;
  numeroVolume: number | null;
}

export interface PostAtualizarDimensoesVolumeNaoDetalhadoLoteParams extends PostAtualizarDimensoesVolumeDetalhadoParams {
  alturaAntiga?: number;
  larguraAntiga?: number;
  comprimentoAntigo?: number;
  pesoAntigo?: number;
}
