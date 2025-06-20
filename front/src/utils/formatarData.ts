import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatarDataPtBr(dataIso: string): string {
  if (!dataIso) return '';
  try {
    return format(parseISO(dataIso), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dataIso;
  }
}

export function formatarMoedaBr(valor: number | string): string {
  const numero = typeof valor === 'string' ? Number(valor) : valor;
  if (isNaN(numero)) return '-';
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
} 