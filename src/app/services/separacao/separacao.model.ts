export interface ItemPedidoDTO {
  produto: {
    imagem: string;
    codigoBarras: string;
    id: string;
    nome: string;
    marca: string;
  };
  medidas: {
    quantidade: string;
    unidade: string;
  };
  fornecedor: {
    id: string;
    nome: string;
  };
  controle: string;
  complemento: string;
}
