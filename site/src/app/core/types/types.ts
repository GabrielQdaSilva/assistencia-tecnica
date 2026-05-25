export interface Funcionario {
  id?: number | string;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
}

export interface Cliente {
  id?: number | string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface OrdemServico {
  id?: number;
  tecnicoId: number;
  tecnicoNome: string;
  clienteId: number;
  clienteNome: string;
  aparelho: string;
  tipoAparelho: string;
  defeito: string;
  status: 'Recebido' | 'Diagnosticando' | 'Aguardando Peças' | 'Em Reparo' | 'Pronto' | 'Entregue';
  dataEntrada: string;
  dataSaida?: string;
  valorServico?: number;
  valorPecas?: number;
  valorTotal?: number;
  observacoes?: string;
}
