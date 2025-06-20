// Função para normalizar o JSON desorganizado da API de clientes
export interface Venda {
  data: string;
  valor: number;
}

export interface ClienteNormalizado {
  id: number;
  nome: string;
  email: string;
  nascimento: string;
  vendas: Venda[];
}

interface ClienteApi {
  id?: number;
  info?: {
    nomeCompleto?: string;
    detalhes?: {
      email?: string;
      nascimento?: string;
    };
  };
  estatisticas?: {
    vendas?: Venda[];
  };
  [key: string]: any;
}

export function normalizarClientes(apiResponse: any): ClienteNormalizado[] {
  if (!apiResponse?.data?.clientes) return [];
  return apiResponse.data.clientes.map((cliente: ClienteApi) => ({
    id: cliente.id ?? 0,
    nome: cliente.info?.nomeCompleto || '',
    email: cliente.info?.detalhes?.email || '',
    nascimento: cliente.info?.detalhes?.nascimento || '',
    vendas: cliente.estatisticas?.vendas || [],
  }));
} 