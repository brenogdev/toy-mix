// Retorna a primeira letra de a-z que não aparece no nome (ignorando acentos e maiúsculas)
export function letraFaltante(nome: string): string {
  const normalizado = nome.normalize('NFD').replace(/[^a-zA-Z]/g, '').toLowerCase();
  for (let i = 97; i <= 122; i++) {
    const letra = String.fromCharCode(i);
    if (!normalizado.includes(letra)) {
      return letra;
    }
  }
  return '-';
} 