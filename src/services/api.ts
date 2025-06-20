export async function login(username: string, password: string) {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao fazer login');
  }
  return res.json();
}

export async function fetchClientes(token: string, filtro?: { nome?: string; email?: string }) {
  const params = new URLSearchParams();
  if (filtro?.nome) params.append('nome', filtro.nome);
  if (filtro?.email) params.append('email', filtro.email);
  const res = await fetch(`http://localhost:3000/clientes?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Erro ao buscar clientes');
  }
  return res.json();
} 