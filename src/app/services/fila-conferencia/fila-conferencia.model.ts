export interface FilaConferenciaDTO {
  numeroUnico: string;
  numeroNota: string;
  numeroModial: string;

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

export interface ParceiroDTO {
  id: string;
  nome: string;
  cpfCnpj: string;
}
