export interface FilaConferenciaDTO {
  numeroUnico: number;
  numeroNota: number;
  numeroModial: number;
  numeroConferencia: number;

  valorNota: string;
  volume: string;
  dataMovimento: string;

  codigoStatus: string;
  descricaoStatus: string;

  codigoTipoMovimento: string;
  descricaoTipoMovimento: string;

  codigoTipoOperacao: string;
  descricaoTipoOperacao: string;

  codigoTipoEntrega: string;
  descricaoTipoEntrega: string;

  idEmpresa: string;
  nomeEmpresa: string;

  idParceiro: string;
  nomeParceiro: string;

  idVendedor: string;
  nomeVendedor: string;

  idUsuarioInclusao: string;
  nomeUsuarioInclusao: string;

  idUsuarioAlteracao: string;
  nomeUsuarioAlteracao: string;
}

export interface PaginationFilter {
  page?: number;
  perPage?: number;
}

export interface FilaConferenciaFilter extends PaginationFilter {
  codigoStatus?: string;
  numeroModial?: string;
  numeroNota?: string;
  numeroUnico?: string;
  dataInicio?: Date | string;
  dataFim?: Date | string;
  idParceiro?: string;
  codigoTipoMovimento?: string;
  codigoTipoOperacao?: string;
  codigoTipoEntrega?: string;
}

export interface DadosBasicosPedidoDTO {
  numeroUnico: number;
  numeroNota: number;
  numeroModial: number;
  numeroConferencia: number;

  codigoStatus: string;
  codigoTipoMovimento: string;
  descricaoTipoOperacao: string;

  idParceiro: number;
  nomeParceiro: string;

  idVendedor: number;
  nomeVendedor: string;
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
