export enum Status {
  AGUARDANDO_CONFERENCIA = 'Aguardando Conferência',
  EM_ANDAMENTO = 'Em Andamento',
  AGUARDANDO_RECONTAGEM = 'Aguardando Recontagem',
  RECONTAGEM_EM_ANDAMENTO = 'Recontagem em Andamento',
  FINALIZADO = 'Finalizado',
}

export enum TipoMovimento {
  COMPRA = 'Compra',
  PEDIDO_VENDA = 'Pedido de Venda',
}

export enum TipoOperacao {
  NOTA_FISCAL_PRODUTO_S_PD = 'Nota Fiscal - Produto (S/PD)',
  NOTA_FISCAL_PRODUTO = 'Nota Fiscal - Produto',
  CUBAGEM_PEDIDO = 'Cubagem de Pedido',
}

export enum TipoEntrega {
  TRANSPORTADORA = 'Transportadora',
}

export interface FilaConferenciaDTO {
  codigoStatus: string;
  descricaoStatus: string;

  idEmpresa: string;
  nomeEmpresa: string;

  numeroModial: string;
  numeroNota: string;
  numeroUnico: string;

  dataMovimento: Date;

  codigoTipoMovimento: string;
  descricaoTipoMovimento: string;

  codigoTipoOperacao: string;
  descricaoTipoOperacao: string;

  codigoTipoEntrega: string;
  descricaoTipoEntrega: string;

  idParceiro: string;
  nomeParceiro: string;

  idVendedor: string;
  nomeVendedor: string;

  valorNota: string;

  volume: string;

  idUsuarioInclusao: string;
  idUsuarioAlteracao: string;
}

export interface ParceiroDTO {
  id: string;
  nome: string;
  cpfCnpj: string;
}
