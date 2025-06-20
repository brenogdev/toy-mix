"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";
import api from "../../../services/api";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarDataPtBr, formatarMoedaBr } from "@/utils/formatarData";
import { Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const vendaSchema = z.object({
  data: z.string().min(1, "Data obrigatória"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
});
type VendaFormData = z.infer<typeof vendaSchema>;

export default function ClienteDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [vendas, setVendas] = useState<
    { id: number; data: string; valor: number }[]
  >([]);
  const [loadingVendas, setLoadingVendas] = useState(true);
  const [erroVendas, setErroVendas] = useState("");
  const [paginaVendas, setPaginaVendas] = useState(1);
  const [totalVendas, setTotalVendas] = useState(0);
  const porPagina = 5;
  const carregandoMais = useRef(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [vendaEditando, setVendaEditando] = useState<any>(null);
  const formVenda = useForm<VendaFormData>({
    resolver: zodResolver(vendaSchema),
    defaultValues: { data: "", valor: 0 },
  });
  const [totalVendasValor, setTotalVendasValor] = useState(0);

  useEffect(() => {
    async function fetchCliente() {
      setLoading(true);
      setErro("");
      try {
        const res = await api.get(`/clientes`, { params: { id } });
        const c = res.data?.data?.clientes?.find(
          (c: unknown) => String((c as any).id) === String(id)
        );
        setCliente(c);
      } catch {
        setErro("Erro ao buscar cliente");
      }
      setLoading(false);
    }
    fetchCliente();
  }, [id]);

  // Função para buscar vendas paginadas (versão simples)
  const fetchVendas = useCallback(
    async (pagina: number) => {
      setLoadingVendas(true);
      setErroVendas("");
      try {
        const res = await api.get(`/sales`, {
          params: { cliente_id: id, pagina, porPagina },
        });
        const novasVendas = res.data?.vendas || [];
        setVendas((prev) =>
          pagina === 1 ? novasVendas : [...prev, ...novasVendas]
        );
        setTotalVendas(res.data?.meta?.total || 0);
        setTotalVendasValor(res.data?.meta?.totalValor || 0);
      } catch {
        setErroVendas("Erro ao buscar vendas");
      }
      setLoadingVendas(false);
      carregandoMais.current = false;
    },
    [id]
  );

  // Carrega a primeira página ao abrir
  useEffect(() => {
    setPaginaVendas(1);
    fetchVendas(1);
  }, [id, fetchVendas]);

  // Handler de scroll infinito
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      console.log("Scroll event:", {
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        vendasLength: vendas.length,
        totalVendas,
      });
      if (
        !loadingVendas &&
        !carregandoMais.current &&
        vendas.length < totalVendas &&
        el.scrollHeight - el.scrollTop - el.clientHeight < 100
      ) {
        carregandoMais.current = true;
        setPaginaVendas((prev) => {
          const proxima = prev + 1;
          fetchVendas(proxima);
          return proxima;
        });
      }
    },
    [loadingVendas, vendas.length, totalVendas, fetchVendas]
  );

  const abrirModalEdicao = (venda: any) => {
    setVendaEditando(venda);
    formVenda.reset({ data: venda.data.slice(0, 10), valor: venda.valor });
    setModalAberto(true);
  };
  const fecharModal = () => {
    setModalAberto(false);
    setVendaEditando(null);
  };

  const onSubmitEdicao = async (data: VendaFormData) => {
    if (!vendaEditando) return;
    try {
      await api.put(`/sales/${vendaEditando.id}`, {
        cliente_id: id,
        data: data.data,
        valor: data.valor,
      });
      toast.success("Venda editada com sucesso!");
      fecharModal();
      setVendas([]);
      setPaginaVendas(1);
      fetchVendas(1);
    } catch {
      toast.error("Erro ao editar venda");
    }
  };

  const excluirVenda = async (venda: any) => {
    if (!window.confirm("Tem certeza que deseja excluir esta venda?")) return;
    try {
      await api.delete(`/sales/${venda.id}`);
      toast.success("Venda excluída com sucesso!");
      setVendas([]);
      setPaginaVendas(1);
      fetchVendas(1);
    } catch {
      toast.error("Erro ao excluir venda");
    }
  };

  return (
    <PrivateRoute>
      <section className="max-w-lg mx-auto">
        <div className="mb-4">
          <Link
            href="/clientes"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Voltar para clientes
          </Link>
        </div>
        <Card className="p-8">
          {loading ? (
            <div className="text-center text-gray-400 py-12">Carregando...</div>
          ) : erro ? (
            <div className="text-center text-red-500 py-12">{erro}</div>
          ) : !cliente ? (
            <div className="text-center text-gray-400 py-12">
              Cliente não encontrado.
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {(cliente as any).info?.nomeCompleto}
              </h2>
              <div className="mb-2">
                <span className="font-semibold">E-mail:</span>{" "}
                {(cliente as any).info?.detalhes?.email}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Nascimento:</span>{" "}
                {(cliente as any).info?.detalhes?.nascimento
                  ? format(
                      new Date((cliente as any).info.detalhes.nascimento),
                      "dd/MM/yyyy",
                      { locale: ptBR }
                    )
                  : "-"}
              </div>
              <div className="mt-8 flex gap-2">
                <Button asChild>
                  <Link href={`/clientes/${id}/nova-venda`}>+ Nova venda</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/clientes/${id}/editar`}>Editar cliente</Link>
                </Button>
              </div>
              {/* Total de vendas */}
              <div className="mb-2 text-right text-sm font-semibold text-gray-700">
                Total:{" "}
                <span className="text-blue-700">
                  {formatarMoedaBr(totalVendasValor)}
                </span>
              </div>
              {/* Listagem de vendas */}
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Vendas
                </h3>
                <div
                  className="max-h-40 overflow-y-auto bg-white rounded"
                  onScroll={handleScroll}
                  style={{ minHeight: 120, padding: 8 }}
                >
                  {loadingVendas && vendas.length === 0 ? (
                    <div className="text-center text-gray-400 py-6">
                      Carregando vendas...
                    </div>
                  ) : erroVendas ? (
                    <div className="text-center text-red-500 py-6">
                      {erroVendas}
                    </div>
                  ) : vendas.length === 0 ? (
                    <div className="text-center text-gray-400 py-6">
                      Nenhuma venda registrada para este cliente.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {vendas.map((venda, idx) => (
                        <li
                          key={`${venda.id}-${idx}`}
                          className="py-3 flex items-center gap-2"
                        >
                          <span>{formatarDataPtBr(venda.data)}</span>
                          <span className="font-semibold text-blue-700 ml-4">
                            {formatarMoedaBr(venda.valor)}
                          </span>
                          <div className="flex-1" />
                          <div className="flex gap-1 ml-2">
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-gray-100"
                              title="Editar venda"
                              onClick={() => abrirModalEdicao(venda)}
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              className="p-1 rounded hover:bg-gray-100"
                              title="Excluir venda"
                              onClick={() => excluirVenda(venda)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </li>
                      ))}
                      {loadingVendas && vendas.length > 0 && (
                        <li className="py-3 text-center text-gray-400">
                          Carregando mais...
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                {vendas.length >= totalVendas && totalVendas > 0 && (
                  <div className="text-center text-gray-400 py-2 text-xs">
                    Todas as vendas carregadas.
                  </div>
                )}
              </div>
            </>
          )}
        </Card>
      </section>
      {/* Modal de edição de venda */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={fecharModal}
              title="Fechar"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Editar Venda</h3>
            <Form {...formVenda}>
              <form
                onSubmit={formVenda.handleSubmit(onSubmitEdicao)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={formVenda.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da venda</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formVenda.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    type="submit"
                    disabled={formVenda.formState.isSubmitting}
                  >
                    {formVenda.formState.isSubmitting
                      ? "Salvando..."
                      : "Salvar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={fecharModal}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
}
