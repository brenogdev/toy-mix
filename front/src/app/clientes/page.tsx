"use client";
import Link from "next/link";
import PrivateRoute from "../../components/PrivateRoute";
import ClienteCard from "../../components/ClienteCard";
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  normalizarClientes,
  ClienteNormalizado,
} from "../../utils/normalizarClientes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ClientesApiResponse {
  data: any;
  meta?: {
    registroTotal?: number;
    pagina?: number;
  };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteNormalizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [registroTotal, setRegistroTotal] = useState(0);
  const [porPagina] = useState(5); // agora 5 por página
  const router = useRouter();

  const fetchClientes = async (
    nome?: string,
    email?: string,
    paginaAtual = 1
  ) => {
    setLoading(true);
    setErro("");
    try {
      const params: Record<string, string | number> = {
        pagina: paginaAtual,
        porPagina,
      };
      if (nome) params.nome = nome;
      if (email) params.email = email;
      const res = await api.get<ClientesApiResponse>("/clientes", { params });
      // Não faz reverse, exibe na ordem que a API retornar
      const normalizados = normalizarClientes(res.data);
      setClientes(normalizados);
      setRegistroTotal(res.data?.meta?.registroTotal || 0);
    } catch {
      setErro("Erro ao buscar clientes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes(nome, email, pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(1);
    fetchClientes(nome, email, 1);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    setLoading(true);
    setErro("");
    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente excluído com sucesso!");
      fetchClientes(nome, email, pagina);
    } catch {
      setErro("Erro ao excluir cliente");
      toast.error("Erro ao excluir cliente");
    }
    setLoading(false);
  };

  const handleEditar = (id: number) => {
    router.push(`/clientes/${id}/editar`);
  };

  const totalPaginas = Math.ceil(registroTotal / porPagina);
  const inicio = (pagina - 1) * porPagina + 1;
  const fim = Math.min(pagina * porPagina, registroTotal);

  return (
    <PrivateRoute>
      <section>
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Voltar para início
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white">Clientes</h2>
          <Link
            href="/clientes/novo"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            + Adicionar Cliente
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form
            className="flex flex-col md:flex-row gap-4 items-center"
            onSubmit={handleFilter}
          >
            <input
              type="text"
              placeholder="Filtrar por nome"
              className="border rounded px-3 py-2 w-full md:w-60"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por e-mail"
              className="border rounded px-3 py-2 w-full md:w-60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Filtrar
            </button>
          </form>
        </div>
        <div className="space-y-4">
          {loading && (
            <div className="text-center text-gray-400 py-12">Carregando...</div>
          )}
          {erro && <div className="text-center text-red-500 py-12">{erro}</div>}
          {!loading && !erro && clientes.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              Nenhum cliente encontrado.
            </div>
          )}
          {clientes.map((cliente: any, idx) => (
            <ClienteCard
              key={cliente.id || idx}
              cliente={cliente}
              onEditar={() => handleEditar(cliente.id)}
              onExcluir={() => handleExcluir(cliente.id)}
            />
          ))}
        </div>
        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex flex-col items-center mt-8 gap-2">
            <div className="text-sm text-gray-600 mb-1">
              Exibindo {inicio} - {fim} de {registroTotal} clientes
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              <span className="px-3 py-1">
                Página {pagina} de {totalPaginas}
              </span>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas || registroTotal === 0}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                aria-label="Próxima página"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
