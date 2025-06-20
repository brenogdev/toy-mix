// Valida se a data está no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)
// e se o ano tem 4 dígitos
export function validarDataIso(data: string): boolean {
  // Aceita apenas datas com ano de 4 dígitos
  const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/;
  if (!regex.test(data)) return false;
  // Verifica se é uma data válida
  const d = new Date(data);
  return !isNaN(d.getTime());
} 