export enum Status {
  TODOS = 'Todos',
  AGUARDANDO_CONFERENCIA = 'Aguardando Conferência',
  EM_ANDAMENTO = 'Em Andamento',
  AGUARDANDO_RECONTAGEM = 'Aguardando Recontagem',
  RECONTAGEM_EM_ANDAMENTO = 'Recontagem em Andamento',
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
  status: Status;
  idEmpresa: string;
  numeroModial: string;
  numeroNota: string;
  numeroUnico: string;
  dataMovimento: Date;
  tipoMovimento: TipoMovimento;
  tipoOperacao: TipoOperacao;
  tipoEntrega: TipoEntrega;
  nomeParceiro: string;
  numeroParceiro: string;
  numeroVendedor: string;
  valorNota: string;
  volume: string;
  idUsuarioInclusao: string;
  idUsuarioAlteracao: string;
}
